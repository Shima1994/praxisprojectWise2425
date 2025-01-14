from flask import Flask, jsonify, request, make_response
from pymongo import MongoClient
from bson import json_util, ObjectId
from flask_cors import CORS
import jwt
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt_identity

app = Flask(__name__)
bcrypt= Bcrypt(app)
secret= "Very_secret_key_thatshouldntbesavedinplaintext"
app.config["SECRET_KEY"]="Very_secret_key_thatshouldntbesavedinplaintext"
jwt=JWTManager(app)
#CORS(app, origins=["http://localhost:4200","http://localhost:4200/tutor","http://localhost:4200/teacher-tutor","http://localhost:4200/teacher-add-question"])


# فعال کردن CORS برای همه مسیرها و روش‌ها
#CORS(app, resources={r"/*": {"origins": "*"}})

CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}}, supports_credentials=True)
client = MongoClient(host='localhost', port=27017)
db = client['IPT_db']

@app.route('/')
def home():
    return 'Hello, World! This is the homepage.'


@app.route('/signup', methods=['POST'])
def save_user():
    code = 500
    res_data = {}
    message = ""
    status = "fail"
    try:
        data = request.get_json()
        username=data['username']  
        firstName = data['firstName']  # اضافه کردن firstName
        lastName = data['lastName']    # اضافه کردن lastName
        if db.users.find_one({'username':username}):
            message = "user with that username already exists"
            code = 401
            status = "fail"
            print("sag signup")
        else:
            # hashing the password so it's not stored in the db as it was
            data['password'] = bcrypt.generate_password_hash(data['password']).decode('utf-8')
            data["experienceLevel"]="beginner"
            data["solvedTasks"]=[]
            data['UserCreated'] = datetime.now()
            data['firstName'] = firstName  # ذخیره firstName
            data['lastName'] = lastName    # ذخیره lastName
            access_token=create_access_token(identity=username)
            res = db.users.insert_one(data)
            if res.acknowledged:
                status = "successful"
                message = "user created successfully"
                code = 200
                res_data={"username":username, "token":access_token, "experienceLevel":data["experienceLevel"],"solvedTasks":data["solvedTasks"],
                          "firstName": data["firstName"],  "lastName": data["lastName"] }
    except Exception as ex:
        message = f"{ex}"
        status = "fail"
        code = 500    
    return jsonify({'status': status, "data": res_data, "message":message}), code


@app.route('/addQuestion', methods=['POST'])
def save_question():
    code = 500
    res_data = {}
    message = ""
    status = "fail"
    try:
        data = request.get_json()
        answer=data['answer']  
        description = data['description'] 
        code = data['code']   
        feedbackCorrect = data['feedbackCorrect'] 
        feedbackWrong = data['feedbackWrong'] 
        hints = data['hints'] 
        questionType = data['questionType'] 
        selectedCategory = data['selectedCategory'] 
        selectedDifficulty= data['selectedDifficulty'] 
        currentUsername= data['currentUsername']
        chartData = data['chartData'] 
        data['UserCreated'] = datetime.now()
        data['description'] = description  
        data['code'] = code    
        data['feedbackCorrect'] = feedbackCorrect  
        data['feedbackWrong'] = feedbackWrong  
        data['hints'] = hints  
        data['questionType'] = questionType  
        data['selectedCategory'] = selectedCategory  
        data['selectedDifficulty'] = selectedDifficulty 
        data['currentUsername'] =currentUsername
        data['chartData'] = chartData
        access_token=create_access_token(identity=answer)
        res = db.questions.insert_one(data)
        if res.acknowledged:
                status = "successful"
                message = "user created successfully"
                code = 200
                res_data={"answer":answer, "token":access_token, 
                          "description": data["description"],  "code": data["code"],"feedbackCorrect": data["feedbackCorrect"] 
                          ,"feedbackWrong": data["feedbackWrong"],  "hints": data["hints"] ,
                          "questionType": data["questionType"],"selectedCategory": data["selectedCategory"],"selectedDifficulty": data["selectedDifficulty"],
                            "currentUsername": data["currentUsername"],"chartData": data["chartData"]}
    except Exception as ex:
        message = f"{ex}"
        status = "fail"
        code = 500    
    return jsonify({'status': status, "data": res_data, "message":message}), code

@app.route('/login', methods=['POST'])
def login():
    message = ""
    res_data = {}
    code = 500
    status = "fail"
    try:
        data = request.get_json()
        username=data['username']
        user = db.users.find_one({'username':username})
        print( "User:",user)
        if user:
            passwordhashed=user["password"]
            password=data["password"]
            experienceLevel = user["experienceLevel"]
            solvedTasksList = user["solvedTasks"]
            firstName = user["firstName"] 
            lastName = user["lastName"] 


            if user and bcrypt.check_password_hash(passwordhashed, password):
                access_token=create_access_token(identity=username)
                message = "user authenticated"
                code = 200
                status = "successful"  
                firstName = user["firstName"]  # نام را از داده‌های کاربر بگیر
                lastName = user["lastName"]    # نام خانوادگی را از داده‌های کاربر بگیر
                res_data={"username":username,
                           "token":access_token, 
                           "experienceLevel":experienceLevel,
                           "solvedTasks":solvedTasksList,
                           "firstName": firstName,
                           "lastName": lastName   }
                print("res_data :",res_data)

            else:
                message = "wrong password"
                code = 401
                status = "fail"
        else:
            message = "invalid login details"
            code = 401
            status = "fail"

    except Exception as ex:
        message = f"{ex}"
        code = 500
        status = "fail"
    return jsonify({'status': status, "data": res_data, "message":message}), code

@app.route('/upload_logged_data', methods=['POST'])
@jwt_required()
def upload_logged_data():
    try:
        data = request.json
        current_user=get_jwt_identity()
        print(current_user)
        print(data["username"])
        result = db.IPT_logs.insert_one(data)
        return jsonify({"success": True, "message": "Data uploaded successfully", "id": str(result.inserted_id)})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

@app.route('/changeExpLevel', methods=['POST'])
@jwt_required()
def changeExpLevel():
    message = ""
    res_data = {}
    code = 500
    status = "fail"
    print(".")
    try:
        data = request.get_json()
        current_user=get_jwt_identity()
        newExpLevel=data["experienceLevel"]
        filter = {'username': current_user}
        newvalues = { "$set": { 'experienceLevel': newExpLevel } }
        db.users.update_one(filter, newvalues)
        code=200
        status="successful"
        res_data={"user_id":current_user}
    except Exception as ex:
        message = f"{ex}"
        code = 500
        status = "fail"
    return jsonify({'status': status, "data": res_data, "message":message}), code

@app.route('/updateSolvedTasks', methods=['POST'])
@jwt_required()
def updateSolvedTasks():
    message = ""
    res_data = {}
    code = 500
    status = "fail"
    try:
        print(request)
        data= request.get_json()
        print("Hello")
        current_user=get_jwt_identity()
        print("works")
        filter = {'username': current_user}
        task=data["taskID"]
        print(task)
        newvalues = { "$push": { 'solvedTasks': task} }
        db.users.update_one(filter, newvalues)
        code=200
        status="successful"
        res_data={"user_id":current_user}
    except Exception as ex:
        print(ex)
        message = f"{ex}"
        code = 500
        status = "fail"
    return jsonify({'status': status, "data": res_data, "message":message}), code

#Teacher part
@app.route('/teacher-signup1', methods=['POST'])
def save_teacher():
    code = 500
    res_data = {}
    message = ""
    status = "fail"
    print("hi")
    try:
        # Get data from the request body
        data = request.get_json()
        username = data['username']

        # Check if the username already exists in the database
        if db.users.find_one({'username': username}):
            message = "A teacher with that username already exists."
            code = 401
            status = "fail"
        else:
            # Hash the password before storing it in the database
            data['password'] = bcrypt.generate_password_hash(data['password']).decode('utf-8')
            
            # You may want to include other teacher-specific fields
            data["experienceLevel"] = "beginner"  # Default experience level
            data["solvedTasks"] = []  # Empty array for initial tasks
            data['UserCreated'] = datetime.now()
            data['role'] = 'teacher'  # Add role as 'teacher' for distinguishing

            # Create a JWT token for the teacher
            access_token = create_access_token(identity=username)

            # Insert the teacher's data into the database
            res = db.users.insert_one(data)
            
            if res.acknowledged:
                status = "successful"
                message = "Teacher created successfully."
                code = 200
                res_data = {
                    "username": username,
                    "token": access_token,
                    "experienceLevel": data["experienceLevel"],
                    "solvedTasks": data["solvedTasks"]
                }
    except Exception as ex:
        message = f"{ex}"
        status = "fail"
        code = 500

    return jsonify({
        'status': status,
        'data': res_data,
        'message': message
    }), code


@app.route('/getquestions/<user>', methods=['GET'])
def get_questions(user):
    try:
        questions = list(db.questions.find({"currentUsername": user}, {"_id": 1, "description": 1, "code": 1, "answer": 1, 
                                                "feedbackCorrect": 1, "feedbackWrong": 1, "hints": 1, 
                                                "questionType": 1, "selectedCategory": 1, "selectedDifficulty": 1, "currentUsername": 1,"chartData": 1 }))
        # تبدیل ObjectId به رشته
        for question in questions:
            question['_id'] = str(question['_id'])
        
        return jsonify({"status": "successful", "data": questions, "message": "Questions fetched successfully"}), 200
    except Exception as ex:
        return jsonify({"status": "fail", "data": [], "message": f"Error fetching questions: {ex}"}), 500
    



@app.route('/questions/<question_id>', methods=['DELETE'])
def delete_question(question_id):
    try:
        result = db.questions.delete_one({"_id": ObjectId(question_id)})
        if result.deleted_count > 0:
            return jsonify({"status": "successful", "message": "Question deleted successfully"}), 200
        else:
            return jsonify({"status": "fail", "message": "Question not found"}), 404
    except Exception as ex:
        return jsonify({"status": "fail", "message": f"Error deleting question: {ex}"}), 500



@app.route('/updatequestions/<question_id>', methods=['PUT'])
def update_question(question_id):
    print(question_id)
    try:
        # دریافت داده‌های به‌روزرسانی از درخواست
        question_payload = request.json
        print(question_payload)
        # بررسی داده‌ها
        if not question_payload:
            return jsonify({"status": "fail", "message": "No data provided"}), 400

        # اجرای به‌روزرسانی در دیتابیس
        result = db.questions.update_one(
            {"_id": ObjectId(question_id)},
            {"$set": question_payload}
        )

        # بررسی نتیجه عملیات
        if result.matched_count > 0:
            return jsonify({"status": "successful", "message": "Question updated successfully"}), 200
        else:
            return jsonify({"status": "fail", "message": "Question not found"}), 404

    except Exception as ex:
        return jsonify({"status": "fail", "message": f"Error updating question: {ex}"}), 500



if __name__=='__main__':
    app.run(debug=True)