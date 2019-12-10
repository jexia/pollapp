"use strict";


var s_p_w = {
  response: undefined,
  html: function html() {
    document.getElementById('pollapp_widget').insertAdjacentHTML('beforeend', "<div id=\"s_p_w_header\" onclick=\"s_p_w.toggle()\"><span><svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" aria-hidden=\"true\" focusable=\"false\" width=\"20px\" height=\"20px\" style=\"vertical-align: -0.143em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);\" preserveAspectRatio=\"xMidYMid meet\" viewBox=\"0 -256 1792 1792\"><path d=\"M640 640q0-53-37.5-90.5T512 512t-90.5 37.5T384 640t37.5 90.5T512 768t90.5-37.5T640 640zm384 0q0-53-37.5-90.5T896 512t-90.5 37.5T768 640t37.5 90.5T896 768t90.5-37.5T1024 640zm384 0q0-53-37.5-90.5T1280 512t-90.5 37.5T1152 640t37.5 90.5T1280 768t90.5-37.5T1408 640zm384 0q0 174-120 321.5t-326 233t-450 85.5q-110 0-211-18q-173 173-435 229q-52 10-86 13q-12 1-22-6t-13-18q-4-15 20-37q5-5 23.5-21.5T198 1398t23.5-25.5t24-31.5t20.5-37t20-48t14.5-57.5T313 1126q-146-90-229.5-216.5T0 640q0-174 120-321.5t326-233T896 0t450 85.5t326 233T1792 640z\" fill=\"white\"/></svg> <span>Join this poll</span></span><span id=\"s_p_w_arrow\"><svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" aria-hidden=\"true\" focusable=\"false\" width=\"15px\" height=\"20px\" style=\"-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);\" preserveAspectRatio=\"xMidYMid meet\" viewBox=\"0 0 1024 1280\"><path d=\"M1011 928q0 13-10 23l-50 50q-10 10-23 10t-23-10L512 608l-393 393q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l466 466q10 10 10 23z\" fill=\"white\"/></svg></span></div><div id=\"s_p_w_body\"><form id=\"s_p_w_poll\" name=\"s_p_w_poll\"></form><div id=\"s_p_w_buttons\"><button id=\"s_p_w_next\" onclick=\"s_p_w.next()\">Next</button></div></div><style>#pollapp_widget{position:fixed;bottom:-100px;right:0;z-index:9999;background:#232323;color:#fff;border-top-left-radius:16px;border-top-right-radius:16px;width:350px;transition:all .5s;font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}#pollapp_widget.s_p_w_loaded{bottom:0}#pollapp_widget #s_p_w_header{background:#222c28;padding:15px 25px;border-top-left-radius:16px;border-top-right-radius:16px;display:flex;justify-content:space-between;align-items:center;cursor:pointer}#pollapp_widget #s_p_w_header span span{margin-left:6px}#pollapp_widget #s_p_w_body{overflow:hidden;max-height:0;transition:all .5s}#pollapp_widget #s_p_w_arrow{transition:all .2s}#pollapp_widget.s_p_w_show #s_p_w_arrow{transform:rotate(180deg) translateY(-2px)}#pollapp_widget.s_p_w_show #s_p_w_body{position:relative;left:0;max-height:1000px}#pollapp_widget #s_p_w_body ul{display:flex;    align-items:flex-end;position:relative;transition:all .5s;padding:0;margin:0}#pollapp_widget #s_p_w_body ul li{width:350px;min-height:130px;list-style:none;padding:15px 25px;max-height:calc(100vh - 160px);overflow-y: auto}#pollapp_widget #s_p_w_body ul li .s_p_w_heading{font-size:20px;font-weight:700}#pollapp_widget #s_p_w_body ul li .s_p_w_answers{display:flex;flex-direction:column;align-items:flex-start;margin:10px 0}#pollapp_widget #s_p_w_body ul li .s_p_w_answers label{cursor:pointer;padding:5px 0;font-size:18px}#pollapp_widget #s_p_w_body ul li .s_p_w_answers input{cursor:pointer}#pollapp_widget #s_p_w_message{display:flex;justify-content:center;align-items:center;text-align:center}#pollapp_widget #s_p_w_buttons{padding:15px 25px;display:flex;justify-content:flex-end}#pollapp_widget #s_p_w_buttons button{background:#222c28;color:#fff;text-transform:uppercase;border:0;padding:8px 20px;font-size:16px;cursor:pointer;font-weight:700}#s_p_w_poll{max-height: calc(100vh - 130px);transition:all 0.3s}#s_p_w_poll ul{height:100%}</style>");
  },
  get: function get() {
    var _this = this;

    var request = new XMLHttpRequest();
    request.open("GET", "https://88fccaba-a957-4aa4-a455-dbd9325a42c4.jexia.app/poll/" + s_p_w_poll_uuid);
    request.send();
    request.addEventListener('load', function (event) {
        if(event.target.status !== 404 && event.target.status !== 500) {
            _this.response = JSON.parse(event.target.response);
            _this.construct(_this.response);
            document.querySelectorAll('#s_p_w_poll ul li').forEach(function (el) {
                var height = 0;
                [].slice.call(el.children).forEach(function (child) {
                    height += child.offsetHeight;
                });
                el.style.height = height + 30 + "px";
            });

            document.getElementById('s_p_w_poll').style.height = document.querySelectorAll('#s_p_w_poll ul li')[s_p_w.current].offsetHeight + "px";

            _this.togglePoll();
        }
    });
  },
  vote: function vote() {
    if (this.response) {
        localStorage.setItem(s_p_w_poll_uuid, this.message);
        var votes = [];

        var questions = 0;

        this.response.questions.forEach(function (el) {
            if (!el.skipped) {
                questions++;
            }
        });

        for (var i = 0; i < questions; i++) {
        votes.push(document.forms['s_p_w_poll']['q' + i].value);
        }

        var request = new XMLHttpRequest();
        request.open("POST", "https://88fccaba-a957-4aa4-a455-dbd9325a42c4.jexia.app/vote");
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(votes));
    }
  },
  toggle: function toggle() {
    document.getElementById('pollapp_widget').classList.toggle('s_p_w_show');
  },
  togglePoll: function togglePoll() {
    document.getElementById('pollapp_widget').classList.toggle('s_p_w_loaded');
  },
  message: '',
  construct: function construct(poll) {
    var _this2 = this;

    this.message = poll.message;
    poll.questions = poll.questions.sort(function (a, b) {
      return a.order - b.order;
    });
    var questions = [];
    poll.questions.forEach(function (el) {
      if (!el.skipped) {
        questions.push(el);
      }
    });
    var ul = document.createElement('ul');
    var i = 0;

    var _loop = function _loop() {
      var question = questions[i];
      var li = document.createElement('li');
      li.setAttribute('data-id', question.id);
      li.setAttribute('data-order', i);
      var heading = document.createElement('span');
      heading.classList.add('s_p_w_heading');
      heading.innerText = question.question;
      li.append(heading);
      var answers = document.createElement('div');
      answers.classList.add('s_p_w_answers');
      question.answers.forEach(function (answer, index) {
        var label = document.createElement('label');
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = "q" + i;
        input.value = answer.id;
        input.checked = index === 0 ? true : false;
        label.append(input);
        label.append(" " + answer.answer);
        answers.append(label);
      });
      li.append(answers);
      ul.append(li);
      _this2.max++;
    };

    for (; i < questions.length; i++) {
      _loop();
    }

    var li = document.createElement('li');
    li.id = 's_p_w_message';
    var heading = document.createElement('span');
    heading.classList.add('s_p_w_heading');
    heading.innerText = poll.message;
    li.append(heading);
    ul.append(li);
    ul.style.width = (this.max + 1) * 350 + 'px';
    document.getElementById('s_p_w_poll').append(ul);
  },
  init: function init() {
    var message = localStorage.getItem(s_p_w_poll_uuid);
    this.html(); //creates childs

    if (message) {
      var poll = document.getElementById('s_p_w_poll');
      poll.insertAdjacentHTML('beforeend', "<ul><li id=\"s_p_w_message\"><span class=\"s_p_w_heading\">".concat(message, "</span></li></ul>"));
      var button = document.getElementById('s_p_w_next');
      button.innerText = 'Close';

      button.onclick = function () {
        s_p_w.toggle();
      };

      this.togglePoll();
    } else {
      this.get();
    }
  },
  next: function next() {
    if (this.current < this.max) {
      this.current++;
      document.getElementById('s_p_w_poll').style.height = document.querySelectorAll('#s_p_w_poll ul li')[s_p_w.current].offsetHeight + "px";
      document.querySelector('#s_p_w_poll ul').style.transform = 'translateX(' + this.current * -350 + 'px)';
    }

    if (this.current === this.max) {
      var button = document.getElementById('s_p_w_next');
      button.innerText = 'Close';

      button.onclick = function () {
        s_p_w.toggle();
      };

      this.vote();
    }
  },
  max: 0,
  current: 0
};
s_p_w.init();
