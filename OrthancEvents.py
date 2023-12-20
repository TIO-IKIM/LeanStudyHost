# for anyone wondering, this is the SDK package of the orthanc container, so don't try pip'ing anything
import orthanc
import http.client
import json

WEBHOOK_URL = "django:8000"
ROUTE = '/OrthancWebhook'

# resources:
# https://bitbucket.org/osimis/orthanc-setup-samples/src/master/python-samples/python-sdk.txt
# https://book.orthanc-server.com/users/rest.html#tracking-changes

# Basic idea:
# check pyorthanc.Orthanc.get_changes()
# OR
# use the plugin events
# to check for stable Patients
# if that event (7) occurs, we iteratively find all connected resources and build a dictionary

# typedef enum
#   {
#     OrthancPluginChangeType_CompletedSeries = 0,    /*!< Series is now complete */
#     OrthancPluginChangeType_Deleted = 1,            /*!< Deleted resource */
#     OrthancPluginChangeType_NewChildInstance = 2,   /*!< A new instance was added to this resource */
#     OrthancPluginChangeType_NewInstance = 3,        /*!< New instance received */
#     OrthancPluginChangeType_NewPatient = 4,         /*!< New patient created */
#     OrthancPluginChangeType_NewSeries = 5,          /*!< New series created */
#     OrthancPluginChangeType_NewStudy = 6,           /*!< New study created */
#     OrthancPluginChangeType_StablePatient = 7,      /*!< Timeout: No new instance in this patient */
#     OrthancPluginChangeType_StableSeries = 8,       /*!< Timeout: No new instance in this series */
#     OrthancPluginChangeType_StableStudy = 9,        /*!< Timeout: No new instance in this study */
#     OrthancPluginChangeType_OrthancStarted = 10,    /*!< Orthanc has started */
#     OrthancPluginChangeType_OrthancStopped = 11,    /*!< Orthanc is stopping */
#     OrthancPluginChangeType_UpdatedAttachment = 12, /*!< Some user-defined attachment has changed for this resource */
#     OrthancPluginChangeType_UpdatedMetadata = 13,   /*!< Some user-defined metadata has changed for this resource */
#     OrthancPluginChangeType_UpdatedPeers = 14,      /*!< The list of Orthanc peers has changed */
#     OrthancPluginChangeType_UpdatedModalities = 15, /*!< The list of DICOM modalities has changed */
#     OrthancPluginChangeType_JobSubmitted = 16,      /*!< New Job submitted */
#     OrthancPluginChangeType_JobSuccess = 17,        /*!< A Job has completed successfully */
#     OrthancPluginChangeType_JobFailure = 18,        /*!< A Job has failed */
#
#     _OrthancPluginChangeType_INTERNAL = 0x7fffffff

msg_lut = {
    0: 'CompletedSeries',
    1: 'Deleted',
    2: 'NewChildInstance',
    3: 'NewInstance',
    4: 'NewPatient',
    5: 'NewSeries',
    6: 'NewStudy',
    7: 'StablePatient',
    8: 'StableSeries',
    9: 'StableStudy',
    10: 'OrthancStarted',
    11: 'OrthancStopped',
    12: 'UpdatedAttachment',
    13: 'UpdatedMetadata',
    14: 'UpdatedPeers',
    15: 'UpdatedModalities',
    16: 'JobSubmitted',
    17: 'JobSuccess',
    18: 'JobFailure',
}


def OnChange(changeType, level, resource, *args, **kwargs):
    # sadly, the orthanc container in use does not use python 3.10, so SPM cannot be used :(
    # print(f'Orthanc_hook:\nNew change: {msg_lut[changeType]}\nResource: {resource}\nLevel: {level}')
    if (changeType == orthanc.ChangeType.STABLE_STUDY) or (changeType == orthanc.ChangeType.DELETED):
        # Define the request body as a dictionary
        request_body = {
            "event": changeType,
            "resource": resource,
            "level": level,
        }
        # Convert the request body to JSON format
        request_body_json = json.dumps(request_body)

        # Define the request headers
        headers = {
            "Content-Type": "application/json"
        }

        # Define the connection and send the POST request
        # Note: This does not work with a context manager
        conn = http.client.HTTPConnection(WEBHOOK_URL)
        conn.request("POST", ROUTE, request_body_json, headers)

        # Get the response
        response = conn.getresponse()

        # Print the response status and data
        if not 200 <= response.status < 300:
            raise ConnectionError(f'Error encountered during request to {WEBHOOK_URL} on route {ROUTE}\n'
                                  f'{response}')

        # Close the connection
        conn.close()


orthanc.RegisterOnChangeCallback(OnChange)
