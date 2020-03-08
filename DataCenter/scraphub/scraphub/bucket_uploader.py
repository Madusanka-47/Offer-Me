import firebase_admin
from google.cloud import storage
from firebase_admin import storage
from firebase_admin import credentials
from google.cloud import storage
from scraphub.global_variable import GlobalVariable
import os


# cred = credentials.Certificate('D:/Projects/trunk/DataCenter/offerme-44bd6-8a78e1bb4d8f.json')
# firebase_admin.initialize_app(cred, {
#     'storageBucket': 'offerme-44bd6.appspot.com'
# })

# bucket = storage.bucket()
class BucketUploader:

    def upload_blob(source_file_name, destination_blob_name):
        service_config = GlobalVariable.config()['service_configurations']
        
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getcwd() + service_config['bucket_AUTH']
        """Uploads a file to the bucket."""
        # bucket_name = "your-bucket-name"
        # source_file_name = "local/path/to/file"
        # destination_blob_name = "storage-object-name"

        storage_client = storage.Client()
        bucket = storage_client.bucket(service_config['file_store'])
        blob = bucket.blob(destination_blob_name)

        blob.upload_from_filename(source_file_name)

        print(
            "File {} uploaded to {}.".format(
                source_file_name, destination_blob_name
            )
        )
