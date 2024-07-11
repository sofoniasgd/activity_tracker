document.addEventListener("DOMContentLoaded", function() {
  // add progress bar library

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
    if (['login', 'register', 'about', 'logout'].includes(page)) {
      window.location.href=`/${page}`;
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
            fetch(`/delete_task/${taskId}`, {
                method: 'POST',
            })
            // reload page after deleting the task
            window.location.reload();
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
            const start = new Date(document.getElementById('start' + taskId).textContent.substring(12));
            const due = new Date(document.getElementById('due' + taskId).textContent.substring(8));
            const timelapsed = Date.now() - start;
            const timetotal = due - start;
            timepercent = timelapsed/timetotal;
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