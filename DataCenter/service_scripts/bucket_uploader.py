import json
import firebase_admin
from google.cloud import storage
from firebase_admin import storage
from firebase_admin import credentials


config = json.load(open('D:/Projects/trunk/DataCenter/scraphub_config.json'))['service_configurations']


# cred = credentials.Certificate('D:/Projects/trunk/DataCenter/offerme-44bd6-8a78e1bb4d8f.json')
# firebase_admin.initialize_app(cred, {
#     'storageBucket': 'offerme-44bd6.appspot.com'
# })

# bucket = storage.bucket()


def upload_blob(bucket_name, source_file_name, destination_blob_name):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = config['bucket_AUTH']
    """Uploads a file to the bucket."""
    # bucket_name = "your-bucket-name"
    # source_file_name = "local/path/to/file"
    # destination_blob_name = "storage-object-name"

    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)

    print(
        "File {} uploaded to {}.".format(
            source_file_name, destination_blob_name
        )
    )
