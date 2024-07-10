document.addEventListener("DOMContentLoaded", function() {
  // add progress bar library
    

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
        const doughnutId = document.getElementById('doughnut' + taskId);
        var bar = new ProgressBar.Circle(doughnutId, {
            color: '#aaa',
            // This has to be the same size as the maximum width to
            // prevent clipping
            strokeWidth: 10,
            trailWidth: 0,
            easing: 'easeInOut',
            duration: 1400,
            from: { color: '#eb070b', width: 3 },
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
        const timediff = Date.now() - start;
        const timetotal = due - start;
        console.log("date total", due - start);
        console.log("datediff", timetotal - timediff);
        const status = document.getElementById('status' + taskId).textContent.substring(8);
        console.log(start, due, status);
        // switch between divs tick{{ task.id }} and doughnut{{ task.id }}
        // !!! set the amount based on the remaining time on the task deadline
        bar.animate(1.0);  // Number from 0.0 to 1.0
    });
});