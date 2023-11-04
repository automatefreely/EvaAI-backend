from flask import Flask, jsonify, request
import os
from langchain.llms import HuggingFaceHub
import time
import warnings
warnings.filterwarnings("ignore")
HUGGING_FACE_API_KEY = "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"
os.environ['HUGGINGFACEHUB_API_TOKEN'] = HUGGING_FACE_API_KEY
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/reply', methods=['POST'])
def handle_post_request():
    if request.method == 'POST':
        data = request.json  # Assuming you expect JSON data in the request
        # You can access the data sent in the request and process it
        # For example, print the data to the console
        print(data)
        key = data.get('key', 'Default Value')
        initial = '''You are best friend of user and you need to do conversation with user as a best friend in positive manner. While relying to user you may cross question him if necessary. You may also continue the conversation. Your reply must be positive. If user's mood is angry your reply must make him calm. If user's mood is sad your reply must make him happy. Your reply should be user's mood(angry or sad or happy) followed by reply to user input. your reply should be: mood + reply. Example reply: angry you need to think about that again. Following is the user input. '''
        prompt = data.get('prompt', 'Hello')
        prompt = initial+prompt
        print(prompt)
        start = time.time()
        llm = HuggingFaceHub(repo_id="google/flan-t5-xxl", model_kwargs={"temperature":0.5, "max_length":256})
        end =  time.time()
        print("Call repo",end-start)
        start = time.time()
        response = llm(prompt)
        end = time.time()
        print("Generate response",end-start)
        print(response)
        data = {
            'result': True,
            'response': response
        }
        return jsonify(data)

if __name__ == '__main__':
    app.run()