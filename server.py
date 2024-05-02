from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

#for gpt
import os
import openai

import secret_key
openai.api_key = secret_key.SECRET_KEY
from chatapp import ChatApp



#for dalle
import json
from base64 import b64decode
from pathlib import Path

gpt = ChatApp()

preference = {
    'genre': '',
    'relationship':'friend',
    'age':'15',
    'scenarios':[]
}

@app.route('/get_scenarios', methods=['GET', 'POST'])
def get_scenarios():
    global preference
    data = request.get_json()

    preference['genre'] = data['genre']
    preference['relationship'] = data['relationship']
    preference['age'] = data['age']

    print('Preference:', data)

    scenarios = gen_scenarios(preference["genre"])
    preference['scenarios'] = scenarios
    print(scenarios)
    print(jsonify(preference))
    #send back the WHOLE array of data, so the client can redisplay it
    return jsonify(preference)

def parse_scenario_from_gpt_response(gpt_response):
    feature_list = gpt_response['content'].splitlines()
    scenario_list = []
    for i, item in enumerate(feature_list):
        item = item.strip()
        if item != "":
            item = item[item.index(":") + 1:]
            item = item.strip()
            scenario_list.append(item)
    return scenario_list


def gen_scenarios(genre):
    # prompt = 'Give me 10 keywords that describe the appearance of a new league of legends champions from the ' + genre + ' genre using formats like this: \n 1. keyword1 \n 2. keyword2 \n 3. keyword3'

    role = 'All your responses will be within 20 words unless specified. You will act as a' + preference['age'] + "-year-old " + preference['relationship']
    prompt = "Create 3 random scenario within 20 words related to " + preference['genre'] + ' to help start our conversation using formats like this: Scenario 1: content\n Scenario 2: content\n Scenario 3: content\n'
    # print(prompt)

    gpt.messages.append({"role": "system", "content": role})
    response = gpt.chat(prompt)

    ### PARSE THEM HERE!
    scenario_list = []
    try:
        scenario_list = parse_scenario_from_gpt_response(response)
    except:
        print("ERROR: gpt scenario response won't parse")
        print(response)

    return scenario_list


@app.route('/get_scenario_msg', methods=['GET', 'POST'])
def get_scenario_msg():
    # print('test in get_scenario_msg')
    data = request.get_json()

    scenario_id = str(int(data['scenario_id'][8:])+1)
    print('Scenario', scenario_id, 'was chosen')

    response = gen_first_msg(scenario_id)
    print(response)
    #send back the WHOLE array of data, so the client can redisplay it
    return jsonify(response)

def gen_first_msg(scenario_id):
    promt = "I will have a conversation with you using scenario " + scenario_id + ". You will start with the first sentance."
    print(promt)
    response = gpt.chat(promt)['content']
    return response


@app.route('/get_chat_msg', methods=['GET', 'POST'])
def get_chat_msg():
    # print('test in get_scenario_msg')
    data = request.get_json()
    msg = data['msg']
    print('User request', msg)
    response = response = gpt.chat(msg)['content']
    return jsonify(response)

@app.route('/get_feedbacks', methods=['GET', 'POST'])
def get_feedbacks():
    data = request.get_json()
    emphasis = data['feedback']
    response = gpt.feedback(emphasis)['content']

    feedback_list = response.splitlines()
    print(feedback_list)
    return jsonify(feedback_list)

@app.route('/')
def home():
    # you can pass in an existing article or a blank one.
    return render_template('home.html', data=preference)


if __name__ == '__main__':
    # app.run(debug = True, port = 4000)
    app.run(debug = True)




