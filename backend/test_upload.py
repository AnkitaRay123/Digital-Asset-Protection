import requests

url = "http://localhost:5000/test-similarity"
files = {'file': open('../image_and_videos/13151652_3840_2160_30fps.mp4', 'rb')}

try:
    response = requests.post(url, files=files)
    print("Status:", response.status_code)
    print("Response:", response.text)
except Exception as e:
    print(e)
