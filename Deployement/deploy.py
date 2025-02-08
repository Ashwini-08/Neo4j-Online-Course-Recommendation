#!/usr/bin/env python3

import argparse
import os
import time
from pprint import pprint

import googleapiclient.discovery
import google.auth

credentials, project = google.auth.default()
service = googleapiclient.discovery.build('compute', 'v1', credentials=credentials)

def list_instances(compute, project, zone):
    result = compute.instances().list(project=project, zone=zone).execute()
    return result['items'] if 'items' in result else None

def create_instance(compute, project, zone, name, bucket, port):
    """Creates an instance with specified configuration."""
    image_response = compute.images().getFromFamily(
        project="ubuntu-os-cloud", family="ubuntu-2204-lts"
    ).execute()
    source_disk_image = image_response["selfLink"]
    machine_type = f"zones/{zone}/machineTypes/e2-medium"

    startup_script = open(
        os.path.join(os.path.dirname(__file__), "startup-script.sh")
    ).read()

    config = {
        "name": name,
        "machineType": machine_type,
        "disks": [
            {
                "boot": True,
                "autoDelete": True,
                "initializeParams": {
                    "sourceImage": source_disk_image,
                },
            }
        ],
        "networkInterfaces": [
            {
                "network": "global/networks/default",
                "accessConfigs": [{"type": "ONE_TO_ONE_NAT", "name": "External NAT"}],
            }
        ],
        "serviceAccounts": [
            {
                "email": "default",
                "scopes": [
                    "https://www.googleapis.com/auth/devstorage.read_write",
                    "https://www.googleapis.com/auth/logging.write",
                ],
            }
        ],
        "metadata": {
            "items": [
                {"key": "startup-script", "value": startup_script},
                {"key": "port", "value": str(port)},
            ]
        },
        "tags": {"items": [f"allow-{port}"]},
    }

    return compute.instances().insert(project=project, zone=zone, body=config).execute()

def wait_for_operation(compute, project, zone, operation):
    print("Waiting for operation to finish...")
    while True:
        result = compute.zoneOperations().get(
            project=project, zone=zone, operation=operation
        ).execute()

        if result["status"] == "DONE":
            print("done.")
            if "error" in result:
                raise Exception(result["error"])
            return result

        time.sleep(1)

def create_firewall_rule(project, port):
    firewall_body = {
        "name": f"allow-{port}",
        "sourceRanges": ["0.0.0.0/0"],
        "targetTags": [f"allow-{port}"],
        "allowed": [{"IPProtocol": "tcp", "ports": [str(port)]}],
    }
    try:
        request = service.firewalls().insert(project=project, body=firewall_body)
        request.execute()
        print(f"Firewall rule 'allow-{port}' created.")
    except Exception as e:
        print(f"Could not create firewall rule: {e}")

def get_instance_external_ip(compute, project, zone, instance_name):
    instance = compute.instances().get(
        project=project, zone=zone, instance=instance_name
    ).execute()
    return instance['networkInterfaces'][0]['accessConfigs'][0]['natIP']

def main(project, bucket, zone, wait=True):
    compute = googleapiclient.discovery.build("compute", "v1")

    print("Creating firewall rules.")
    create_firewall_rule(project, 3000)
    create_firewall_rule(project, 3001)

    print("Creating frontend instances.")
    for i in range(2):
        instance_name = f"frontend-instance-{i+1}"
        operation = create_instance(compute, project, zone, instance_name, bucket, 3000)
        wait_for_operation(compute, project, zone, operation["name"])
        external_ip = get_instance_external_ip(compute, project, zone, instance_name)
        print(f"Frontend instance {instance_name} created at http://{external_ip}:3000")

    print("Creating backend instance.")
    backend_name = "backend-instance"
    operation = create_instance(compute, project, zone, backend_name, bucket, 3001)
    wait_for_operation(compute, project, zone, operation["name"])


    
    backend_ip = get_instance_external_ip(compute, project, zone, backend_name)
    print(f"Backend instance {backend_name} created at http://{backend_ip}:3001")

    if wait:
        input("Press Enter to keep the instances running...")

    print("Instances are still running. Exiting the program.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("project_id", help="Your Google Cloud project ID.")
    parser.add_argument("bucket_name", help="Your Google Cloud Storage bucket name.")
    parser.add_argument(
        "--zone", default="us-west1-b", help="Compute Engine zone to deploy to."
    )

    args = parser.parse_args()

    main(args.project_id, args.bucket_name, args.zone)
