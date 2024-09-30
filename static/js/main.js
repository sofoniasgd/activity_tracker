document.addEventListener("DOMContentLoaded", function() {
  // add function to make flash messages disappear after 5 seconds
  setTimeout(function() {
    $(".flash_alert").fadeOut('slow');
  }, 5000);
  // add event listeners to nav buttons
  const navButtons = document.querySelectorAll(".nav_btn");
  navButtons.forEach(button => {
    button.addEventListener("click", handleNavBtnClick);
  });
  // function to handle nav button click and change the active button
  function handleNavBtnClick(event) {
    navButtons.forEach(button => {
      button.classList.remove("active");
    });
    event.target.classList.add("active");
    console.log(event.target.textContent.toLowerCase());
    // goto the page based on the button clicked
    const page = event.target.textContent.toLowerCase();
    if (['login', 'register', 'logout'].includes(page)) {
      window.location.href=`/${page}`;
    }
    else if (page === 'about') {
      window.location.href=`https://sofoniasgd.github.io/activity_tracker/`;
    }
    
  }


  // add custom bootstrap form validation
  var forms = document.getElementsByClassName('needs-validation');
  // Loop over them and prevent submission
  var validation = Array.prototype.filter.call(forms, function(form) {
    form.addEventListener('submit', function(event) {
      if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
  // add event listeners to all update task buttons
  updateButtons = document.querySelectorAll(".edit_btn");
  updateButtons.forEach(button => {
    button.addEventListener("click", handleUpdateBtnClick);
  });
  // add event listeners to all cancel buttons
  cancelButtons = document.querySelectorAll(".cancel_btn");
  cancelButtons.forEach(button => {
    button.addEventListener("click", handleCancelBtnClick);
  });
  // add event listeners to all delete buttons
    deleteButtons = document.querySelectorAll(".delete_btn");
    deleteButtons.forEach(button => {
      button.addEventListener("click", handleDeleteBtnClick);
    });

  // task form id is "task_form{{ task.id }}"
  // task display id is "task_display{{ task.id }}"
  // function to handle update button click and make task form visible and task div hidden
    function handleUpdateBtnClick(event) {
        const taskId = event.target.id.substring(13);
        //console.log("taskID=", taskId);
        
        const taskDiv = document.getElementById('task_display' + taskId);
        const taskForm = document.getElementById('task_form' + taskId);
        //console.log('task_display status=>', taskDiv.style.display);
        //console.log('task_form status=>', taskForm.style.display);
        taskDiv.style.display = 'none';
        taskForm.style.display= 'block';
   }
  // function to handle cancel button click and make task form hidden and task div visible
    function handleCancelBtnClick(event) {
        const taskId = event.target.id.substring(15);
        //console.log("taskID=", taskId);
        
        const taskDiv = document.getElementById('task_display' + taskId);
        const taskForm = document.getElementById('task_form' + taskId);
        //console.log('task_display status=>', taskDiv.style.display);
        //console.log('task_form status=>', taskForm.style.display);
        taskDiv.style.display = 'block';
        taskForm.style.display = 'none';
    }

  // function to handle delete button click and delete task
    function handleDeleteBtnClick(event) {
        const taskId = event.target.id.substring(15);
        // console.log("taskID=", taskId);
        const taskDiv = document.getElementById('task_display' + taskId);
        const taskForm = document.getElementById('task_form' + taskId);
        // popup confirmation before deleting the task
        if (confirm("Are you sure you want to delete this task?") == true) {
            fetch(`/delete_task/${taskId}`, { method: 'POST'})
            .then(response => {
              if (response.ok) {
                window.location.reload();
              } else {
                console.log(response);
                window.alert('Task deletion failed');
              }
            })
            .catch(error => {
              console.error('There has been a problem with the fetch operation:', error);
            });

            // reload page after deleting the task
           
        }
    }

  // Add task form toggle, runs only on dashboard page
  if (document.URL.includes("/dashboard")) {
    const addFormBtn = document.getElementById("add_task_btn");
    const addFormDiv = document.getElementById("add_task_form");
  
    addFormBtn.addEventListener("click", function() {
      if(addFormDiv.style.display === 'none' || addFormDiv.style.display === '') {
          addFormDiv.style.display = 'block';
          addFormBtn.textContent = 'Hide Form';
          //console.log("visible");
          } else {
              addFormDiv.style.display = 'none';
              addFormBtn.textContent = 'Add Task';
              //console.log("hidden");
          }
    });
    }
  

  // Task visual status script
  // get a list of all visual divs
    const visualDivs = document.querySelectorAll('.task_visual_display');
    // loop through each visual div
    visualDivs.forEach(visualdiv => {
        // get the task id from the div id
        const taskId = visualdiv.id.substring(11);
        console.log("taskID=", taskId);
        // get doughnut and tick div ids
        const doughnutId = document.getElementById('doughnut' + taskId);
        const tickId = document.getElementById('tick' + taskId);
        // depending on status of the task either display the tick(complete) or doughnut(in_progress or ongoing)
        const taskStatus = document.getElementById('status' + taskId).textContent.substring(8);
        if (taskStatus === 'Complete') {
            tickId.style.display = 'block';
            doughnutId.style.display = 'none';
            // tick animation here
            var tick = new ProgressBar.Path('#tick_path', {
                easing: 'easeInOut',
                duration: 1400
              });
              
              tick.set(0);
              tick.animate(1.0);  // Number from 0.0 to 1.0
        }
        else {
            tickId.style.display = 'none';
            doughnutId.style.display = 'block';
            // doughnut animation here
            var bar = new ProgressBar.Circle(doughnutId, {
                color: '#aaa',
                // This has to be the same size as the maximum width to
                // prevent clipping
                strokeWidth: 10,
                trailWidth: 10,
                easing: 'easeInOut',
                duration: 1400,
                from: { color: '#eb070b', width: 10 },
                to: { color: '#19fa05', width: 10 },
                // Set default step function for all animate calls
                step: function(state, circle) {
                    circle.path.setAttribute('stroke', state.color);
                    circle.path.setAttribute('stroke-width', state.width);
                    var value = Math.round(circle.value() * 100);
                }
            });
            // get the task dedline from the task div
            // start{{ task.id }}  due{{ task.id }}  status{{ task.id }}
            // start= timelog_start{{ task.id }} end=timelog_end{{ task.id }}
            // duration= timelog_duration{{ task.id }}
            
            
            timelog_start = document.getElementById('timelog_start' + taskId).textContent;
            timelog_due = document.getElementById('timelog_due' + taskId).textContent;
            // get start and end times in milliseconds
            const start = Date.parse(timelog_start);
            const due = Date.parse(timelog_due);
            console.log("start", start);
            console.log("end", due);
            
            
            var timelapsed = Date.now() - start;
            var timetotal = due - start;
            console.log("timenow", Date.now());
            console.log("timeelapsed", timelapsed);
            console.log("timetotal", timetotal);
            // flip time total if negative
            if (timetotal < 0) {
              timetotal = timetotal * -1;
            }
            // if timelapsed is negative then task starts in the future so set progress to 0
            if (timelapsed < 0) {
              timelapsed = 0;
            }
            // const timetotal = document.getElementById('timelog_duration' + taskId).textContent
            timepercent = timelapsed/timetotal;
            // if timepercent is greater than 1 then set it to 1
            if (timepercent > 1) {
              timepercent = 1;
            }
            const status = document.getElementById('status' + taskId).textContent.substring(8);
            if (status === 'in_progress') {
                // set the color of the doughnut to green
                bar.path.setAttribute('stroke', '#19fa05');
            } else if (status === 'todo') {
                // set the color of the doughnut to red
                bar.path.setAttribute('stroke', '#eb070b');
            }
            // switch between divs tick{{ task.id }} and doughnut{{ task.id }}
            // !!! set the amount based on the remaining time on the task deadline
            console.log("timepercent=", timepercent);
            bar.animate(timepercent);  // Number from 0.0 to 1.0
        
        }  
    });
});