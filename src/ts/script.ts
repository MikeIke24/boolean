
  
  class ConvertedBoolText {
    activeText = "";
    allowAnd: boolean = true;
    activeSource: string;
    
    constructor(text:string, source:string) {
      this.activeText = this.general(text);
      this.activeSource = "agentEM";
      this.activeSource = source;
    }
      
    general(text:string) {
      let textCopy = text;
      for (let i = 0; i < text.length; i++) {
        if (text.charAt(i) == "(" || text.charAt(i) == "[") {
          this.allowAnd = false;
        } else if (text.charAt(i) === ")" || text.charAt(i) == "]") {
          this.allowAnd = true;
        } else if (text.charAt(i) === " ") {
          if (text.charAt(i + 1) === "-") {
            let replaceString = "NOT ";
            text = setCharAt(text, i + 1, replaceString);
            i = i + replaceString.length;
          } else if (this.allowAnd) {
            let replaceString = " AND ";
            text = setCharAt(text, i, replaceString);
            i = i + replaceString.length - 1;
          }
        }
      }
  
      // if 'or' is in lowercase, convert to uppercase
      text = text.replace(/\sor\s/g, " OR ");
      
      if (formSettings.radioSelection !== "agentEM") {
        let reOr = /\(([^()]+)\)/g;
        
        text = text.replace(reOr, orAdder);
        
        let re = /\[([a-zA-Z0-9-\s\*]+)\]/g;
        switch (formSettings.radioSelection) {
          case "monster":
            text = text.replace(re, this.monster);
            break;
          case "careerBuilder":
            text = text.replace(re, this.careerBuilder);
            break;
          case "dice":
            text = text.replace(re, this.dice);
            break;
        }
      }
      else{
        return textCopy;
      }
      
      text = text.replace('_',' ');
      return text;
    }
    monster(match:string) {
      return nearAdder(match,formSettings.nearNum,'monster');
    }
    careerBuilder(match:string) {
      return nearAdder(match,formSettings.nearNum,'careerBuilder');
    }
    dice(match:string) {
      return nearAdder(match,formSettings.nearNum,'dice');
    }
  
  }
  class FormSettings {
    radioSelection: string = "agentEM";
    nearNum = $('#near-select').find(":selected").text();
  }
  /*----------------------------------------*/
  let formSettings = new FormSettings();
  modal("#renderPopups", "#settings-btn");
  
  $("#boolUpdate").click(function() {
    let boolText = $("#boolIn").val();
    let convertedBoolText = new ConvertedBoolText(
      boolText,
      formSettings.radioSelection
    );
    $("#boolOut").text(convertedBoolText.activeText);
  });
  $("#form").submit(function(e) {
    e.preventDefault();
  });
  
  $("#form input").on("change", function() {
    formSettings.radioSelection = $("input[name=sources]:checked", "#form").val();
  });
  
  $('#near-select').on("change",function(){
    formSettings.nearNum = $('#near-select').find(":selected").text();
    document.getElementById('boolUpdate').click();
  });
  
  new Clipboard('#boolOut');
  $('#boolOut').click(function(){
    if($('#boolOut').text()){
    $('#copiedInfo').html(`<div class="alert alert-success text-center">
    <strong>Success!</strong> Text copied to clipboard.
  </div>`).fadeIn("slow");
  setTimeout(function(){
      $('#copiedInfo').fadeOut("slow");
    },1500);
  }
  });
  /*----------------------------------------*/
  function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
  }
  
  function nearAdder(match:string,nearNumber:number,source:string){
      let innerText = match.slice(1, -1);
      let innerText = innerText.split(" ");
      let nearText:string;
      switch(source){
        case 'dice':
          nearText = ` NEAR/${nearNumber} `;
          break;
        case 'careerBuilder':
          nearText = ` NEAR${nearNumber} `;
          break;
        default:
          nearText = ' NEAR ';
                   }
      innerText.splice(1, 0,nearText);
      innerText.push(")");
      innerText.unshift("(");
      return innerText.join("");
    }
  
  function orAdder(match:string){
    return match.replace(new RegExp(' ', 'g'), ' OR ');
    }
  
  function modal(containerDiv, clickTrigger) {
    var modalOpen = false;
    $(clickTrigger).on("click", function() {
      modalOpen = true;
      let htmlPopup = "";
      htmlPopup += `<div id="popup">${modalContent()}</div>`;
      $(containerDiv).html(htmlPopup);
  
      var [modalTop, winHeight, topPos] = modalSizing();
  
      $(containerDiv).fadeIn(450);
      $("#popup").animate({ top: modalTop + "px" }, 425);
  
      window.onscroll = function() {
        window.scrollTo(0, topPos);
      };
  
      $(window).resize(function() {
        [modalTop, winHeight, topPos] = modalSizing(modalOpen);
      });
  
      $("#xButtonPopup").on("click", function() {
        modalOpen = false;
        $(window).off("resize");
        $(containerDiv).fadeOut(450);
        $("#popup").animate({ top: winHeight + topPos + 10 + "px" }, 425);
        window.onscroll = function() {};
      });
    });
  }
  
  function modalSizing(modalOpen) {
    var winHeight = $(window).height();
    var winWidth = $(window).width();
    var topPos = document.body.scrollTop;
  
    var modalHeight = 0.8 * winHeight;
    var stopGrowing = window.screen.width / 1.5;
    if (winWidth >= stopGrowing) {
      var modalWidth = stopGrowing * 0.95;
    } else {
      var modalWidth = winWidth * 0.95;
    }
    var modalTop = winHeight * 0.5 - modalHeight * 0.5;
    var modalLeft = winWidth * 0.5 - modalWidth * 0.5;
    if (modalOpen) {
      $("#popup").css("top", modalTop + "px");
    } else {
      $("#popup").css("top", winHeight + topPos + 10 + "px");
    }
    $("#popup").css("left", modalLeft + "px");
    $("#popup").css("height", modalHeight + "px");
    $("#popup").css("width", modalWidth + "px");
  
    return [modalTop, winHeight, topPos];
  }
  
  function modalContent() {
    let html = "";
    html += `
      <div class="modal-header">
        <div class="modal-top-sizing"></div>
        <div class="modal-title">
          Settings
        </div>
        <div id="xButtonPopup" class="modal-top-sizing">
          <i class="fa fa-times" aria-hidden="true"></i>
        </div>
      </div>
      <div class="modal-body">
      <h4 class="text-center">Instructions:</h4>
  <br>
  <ul>
  <li class="inst-li"><b>To add an "AND" just add a space.</b>
  <br>
   Ex: Java Sql Oracle = Java AND Sql AND Oracle</li>
  <div class="hor-line"></div>
  <li class="inst-li"><b>To add an "OR" just add a space between words inside parenthesis.</b>
  <br>
   Ex: (Java Sql) Oracle = (Java OR Sql) AND Oracle</li>
  <div class="hor-line"></div>
  <li class="inst-li"><b>To add a "NOT" just add a minus sign before the word to be ommitted.</b>
  <br>
   Ex: Java Sql -Oracle = Java AND Sql NOT Oracle</li>
  <div class="hor-line"></div>
  <li class="inst-li"><b>Use quotes to find an exact match.</b>
  <br>
  Ex: "develop" matches "develop" but not "developers"</li>
  <div class="hor-line"></div>
  <li class="inst-li"><b>Use an asterisk to match anything after what's typed.</b>
  <br>
  Ex: "devel*" matches "develop" and "developers"</li>
  <div class="hor-line"></div>
  <div class="hor-line"></div>
  <li class="inst-li"><b>Use two words inside of brackets to perform proximity searches.</b>
  <br>
  <b>Use the optional proximity selectors to set the max word separation count.</b>
  <br>
  Monster Ex: [sql developer] = sql NEAR developer
  <br>
  Career Builder Ex: [sql developer] = sql NEAR3 developer
  <br>
  Dice Ex: [sql developer] = sql NEAR/3 developer
  </li>
  </ul>
     </div>
  `;
    return html;
  }