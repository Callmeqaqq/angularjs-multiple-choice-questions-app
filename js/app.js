let app = angular.module("app", ["ngRoute"])
app.config(function ($routeProvider) {
    $routeProvider
        .when("/contact", {templateUrl: "contact.html"})
        .when("/introduce", {templateUrl: "introduce.html"})
        .when("/trac-nghiem", {templateUrl: "courses.html", controller: "listSubjectsCtrl"})
        .when("/multiple-choice/:idSUB/:nameSUB", {templateUrl: "multiple-choice.html", controller: "multiCtrl"})
        .otherwise({template: "<h1>👨‍🏫 Welcome back! Student</h1>"})
})

app.controller("listSubjectsCtrl", function ($scope) {
    $scope.start = 0;
    $scope.prevPage = () => {
        $scope.start -= 4;
    }

    $scope.nextPage = () => {
        $scope.start += 4;
    }

})

app.controller("multiCtrl", function ($scope, $http, $routeParams, $interval) {

    //init variable
    $scope.idSUB = $routeParams.idSUB;
    $scope.nameSUB = $routeParams.nameSUB;
    implement();

    //get data
    getData();

    //save to local every click on radio button
    $scope.choiceSelected = function (id) {

        //selected radio button answer
        if ($scope.selectedRadio.length === 0) {
            $scope.selectedRadio.push({id: $scope.idOfCurrentQuestion, answer: id})
        } else {
            let flag = false;
            $scope.selectedRadio.map((item, index) => {
                if (item.id === $scope.idOfCurrentQuestion) {
                    flag = true;
                    $scope.selectedRadio[index].answer = id;
                }
            })
            if (flag === false) {
                $scope.selectedRadio.push({id: $scope.idOfCurrentQuestion, answer: id})
            }
        }

        //right answer array
        if (id === $scope.rightAnswer) {
            if ($scope.listOfRightAnswer.length === 0) {
                $scope.listOfRightAnswer.push(id)
            } else {
                let flag = false;
                $scope.listOfRightAnswer.map(item => {
                    if (item === id) {
                        flag = true;
                    }
                })
                if (flag === false) {
                    $scope.listOfRightAnswer.push(id)
                }
            }
        } else {
            $scope.listOfRightAnswer.map((item, index) => {
                if (item === $scope.rightAnswer) {
                    $scope.listOfRightAnswer.splice(index, 1)
                }
            })
        }

        //save to local
        const checkAnswer = $scope.handleAnswer(id, $scope.rightAnswer);
        const localData = JSON.parse(localStorage.getItem($scope.idSUB))
        if (localData) {
            //update object
            localData.find((object, i) => {
                if (object.questionId === $scope.idOfCurrentQuestion) {
                    localData[i] = {
                        questionId: $scope.idOfCurrentQuestion,
                        answer: id,
                        check: checkAnswer
                    };
                    return true; //stop searching
                }
            });
            //check for add new object to array if key doesn't exist
            const index = localData.findIndex(x => x.questionId === $scope.idOfCurrentQuestion);
            if (index === -1) {
                localData.push({
                    questionId: $scope.idOfCurrentQuestion,
                    answer: id,
                    check: checkAnswer
                })
            }
            $scope.saveToLocal($scope.idSUB, localData)
        } else {
            const firstObj = [{
                questionId: $scope.idOfCurrentQuestion,
                answer: id,
                check: checkAnswer
            }];
            $scope.saveToLocal($scope.idSUB, firstObj)
        }
    }

    $scope.handleAnswer = (answer, rightAnswer) => {
        let checkAnswer = false;
        if (answer === rightAnswer) {
            checkAnswer = true;
        }
        return checkAnswer;
    }

    $scope.saveToLocal = (key, Obj) => {
        const myJSON = JSON.stringify(Obj);
        localStorage.setItem(key, myJSON);
    }

    //button action
    $scope.next = () => {
        $scope.currentIndex += 1
        handleQuestionLogic()
        $scope.first = false;
        if ($scope.currentIndex === $scope.listTenQuestions.length - 1) {
            $scope.last = true;
        }
    }

    $scope.prev = () => {
        $scope.currentIndex -= 1
        handleQuestionLogic()
        $scope.last = false;
        if ($scope.currentIndex === 0) {
            $scope.first = true;
        }
    }

    $scope.handIn = () => {
        let handInCheck = confirm("Bạn có chắc muốn nộp bài không?");
        if (handInCheck) {
            const totalRight = $scope.listOfRightAnswer.length
            const totalQuestions = $scope.listTenQuestions.length;
            $scope.totalPoint = (totalRight * 100 / totalQuestions) / 10;// point/100
            $scope.handed = true;
            $interval.cancel($scope.intervalTime);
            let localData = JSON.parse(localStorage.getItem($scope.idSUB))
            if (localData) {
                localData.push({
                    handed: true,
                    score: $scope.totalPoint,
                    time: $scope.renderTime,
                    answers: $scope.listTenQuestions
                })
                $scope.saveToLocal($scope.idSUB, localData)
            }
        }
    }

    $scope.lastQuestion = () => {
        $scope.currentIndex = $scope.listTenQuestions.length - 1;
        handleQuestionLogic()
        $scope.first = false;
        $scope.last = true;
    }

    $scope.firstQuestion = () => {
        $scope.currentIndex = 0;
        handleQuestionLogic();
        $scope.last = false;
        $scope.first = true;
    }

    $scope.tryAgain = () => {
        localStorage.removeItem($scope.idSUB);
        getData();
        $scope.handed = false;
        implement();
    }

    function implement() {
        $scope.questions = [];
        $scope.selectedRadio = [];
        $scope.listOfRightAnswer = [];
        $scope.listTenQuestions = [];
        $scope.currentIndex = 0;
        $scope.totalQuestions = 0;
        $scope.initSelected = null;
        $scope.first = true;
        $scope.last = false;
    }

    $scope.showAnswer = () => {
        let localData = JSON.parse(localStorage.getItem($scope.idSUB))
        if (localData) {
            $scope.historyQuestions = localData.find(item => {
                return item.handed === true;
            })
            $scope.historyRightAnswer = [];
            localData.map(item => {
                if (item.check === true) {
                    $scope.historyRightAnswer.push(item)
                }
            })
            $scope.historyWrongAnswer = [];
            localData.map(item => {
                if (item.check === false) {
                    $scope.historyWrongAnswer.push(item)
                }
            })
            $scope.historyAnyAnswer = [];
            localData.map(item => {
                if (item.questionId) {
                    $scope.historyAnyAnswer.push(item)
                }
            })
            console.log($scope.historyAnyAnswer)
        } else {
            alert("Bạn chưa trả lời câu hỏi nào để có thể xem!!, vui lòng làm lại")
        }
    }

    $scope.newTime = () => {
        $scope.time = 900; //15 minute
        $scope.intervalTime = $interval(function () {
            $scope.time--;
            $scope.timeHanded = 900 - $scope.time;
            if ($scope.time === 0) {
                $scope.handIn();
            }
            $scope.timeHanded = new Date($scope.timeHanded * 1000).toISOString().substr(14, 5);
            $scope.renderTime = new Date($scope.time * 1000).toISOString().substr(11, 8);
        }, 1000)
    }


    function handleQuestionLogic() {
        $scope.currentQuestion = $scope.listTenQuestions[$scope.currentIndex]
        $scope.rightAnswer = $scope.currentQuestion.AnswerId;
        $scope.idOfCurrentQuestion = $scope.currentQuestion.Id;
        $scope.selectedRadio.map(item => {
            if (item.id === $scope.idOfCurrentQuestion) {
                $scope.selectedElement = item.answer
            }
        })
    }

    function getData() {
        let localData = JSON.parse(localStorage.getItem($scope.idSUB))
        if (localData) {
            let flag = false;
            localData.find(item => {
                if (item.handed === true) {
                    flag = true;
                    $scope.handed = true;
                    $scope.totalPoint = item.score
                    $scope.renderTime = item.time
                }
            })
            if(flag === false){
                getApiData();
            }
        } else {
            getApiData();
        }
    }

    function getApiData() {
        $http.get("database/" + $scope.idSUB + ".js")
            .then(
                function (d) {
                    $scope.questions = d.data;

                    //get random 10 questions
                    $scope.questions.map(item => {
                        if ($scope.listTenQuestions.length < 10) {
                            let randomN = Math.floor(Math.random() * $scope.questions.length);
                            let flag = false;

                            if ($scope.listTenQuestions.length === 0) {
                                $scope.listTenQuestions.push($scope.questions[randomN])
                            } else {
                                $scope.listTenQuestions.map(i => {
                                    if (i.Id === randomN) {
                                        flag = true;
                                    }
                                })
                                if (flag === false) {
                                    $scope.listTenQuestions.push($scope.questions[randomN])
                                }
                            }
                        }
                    })
                    $scope.totalQuestions = $scope.questions.length;
                    $scope.currentQuestion = $scope.listTenQuestions[$scope.currentIndex]
                    $scope.rightAnswer = $scope.currentQuestion.AnswerId;
                    $scope.idOfCurrentQuestion = $scope.currentQuestion.Id;
                    $scope.handed = false;
                    $scope.newTime();
                },
                function () {
                    alert("Lỗi");
                }
            )
    }
})

app.controller("ctrl", function ($scope, $http) {
    $scope.subjects = [];
    $http.get("js/subjects.js")
        .then(function (d) {
            $scope.subjects = d.data;
        })
})