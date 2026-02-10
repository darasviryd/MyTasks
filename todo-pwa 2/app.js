document.addEventListener('DOMContentLoaded', () => {
  const views = document.querySelectorAll('.view');
  const navButtons = document.querySelectorAll('.hero-nav button');

  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoDate = document.getElementById('todo-date');
  const todoTime = document.getElementById('todo-time');

  const todoList = document.getElementById('todo-list');
  const counter = document.getElementById('counter');
  const clearCompletedBtn = document.getElementById('clear-completed');

  const calendarGrid = document.getElementById('calendar-grid');
  const calendarTitle = document.getElementById('calendar-title');
  const dayTasksBox = document.getElementById('day-tasks');
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');

  const geoBtn = document.getElementById('geo-btn');
  const geoOutput = document.getElementById('geo-output');

  const notifToggle = document.getElementById('notif-toggle');
  const notifStatus = document.getElementById('notif-status');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let currentDate = new Date();
  let notificationsEnabled = JSON.parse(localStorage.getItem('notifications')) || false;

  const monthNames = [
    'Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec',
    'Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'
  ];

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
  
      
      views.forEach(v => v.classList.remove('active'));
      document.getElementById(btn.dataset.view).classList.add('active');
  
      
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
  
      
      if (btn.dataset.view === 'calendar') {
        renderCalendar();
      }
    });
  });
  function saveTasks() { localStorage.setItem('tasks', JSON.stringify(tasks)); }

  function renderTasks() {
    todoList.innerHTML = '';
    tasks.forEach(task => {
      const li = document.createElement('li');
      if(task.done) li.classList.add('done');

      const span = document.createElement('span');
      span.textContent = `${task.text} (${task.date} ${task.time || '--:--'})`;
      span.onclick = () => {
        const edit = prompt('Edytuj zadanie:', task.text);
        if(edit){ task.text = edit.trim(); saveTasks(); renderTasks(); }
      };

      const toggle = document.createElement('button');
      toggle.textContent = '✔';
      toggle.onclick = () => { task.done = !task.done; saveTasks(); renderTasks(); };

      const del = document.createElement('button');
      del.textContent = '✖';
      del.onclick = () => { tasks = tasks.filter(t => t.id !== task.id); saveTasks(); renderTasks(); };

      li.append(span, toggle, del);
      todoList.appendChild(li);
    });
    counter.textContent = `${tasks.length} zadań • ${tasks.filter(t=>t.done).length} ukończonych`;
    renderCalendar();
  }

  todoForm.addEventListener('submit', e => {
    e.preventDefault();
    if(!todoInput.value.trim() || !todoDate.value) return;

    const newTask = { id:Date.now(), text:todoInput.value.trim(), done:false, date:todoDate.value, time:todoTime.value };
    tasks.push(newTask);
    todoInput.value = ''; todoDate.value = ''; todoTime.value = '';
    saveTasks(); renderTasks();

    if(notificationsEnabled && 'Notification' in window && Notification.permission==='granted')
      new Notification('Nowe zadanie',{body:newTask.text});
  });

  clearCompletedBtn.onclick = () => { tasks = tasks.filter(t => !t.done); saveTasks(); renderTasks(); };

  function renderCalendar(){
    calendarTitle.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    calendarGrid.innerHTML='';
    const firstDay = new Date(currentDate.getFullYear(),currentDate.getMonth(),1);
    const lastDay = new Date(currentDate.getFullYear(),currentDate.getMonth()+1,0);
    const startDay = (firstDay.getDay()+6)%7;
    for(let i=0;i<startDay;i++) calendarGrid.appendChild(document.createElement('div'));
    for(let d=1;d<=lastDay.getDate();d++){
      const dayDiv=document.createElement('div'); dayDiv.classList.add('day');
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      dayDiv.textContent=d;
      if(tasks.some(t=>t.date===dateStr)) dayDiv.classList.add('has-task');
      dayDiv.onclick=()=>showTasksForDay(dateStr);
      calendarGrid.appendChild(dayDiv);
    }
  }
  function showTasksForDay(dateStr) {
    const dayTasks = tasks.filter(t => t.date === dateStr);
  
    dayTasksBox.innerHTML = `<h3>Zadania na ${dateStr}</h3>`;
  
    if (!dayTasks.length) {
      dayTasksBox.innerHTML += '<p>Brak zadań</p>';
      return;
    }
  
    dayTasks.forEach(t => {
      const div = document.createElement('div');
      div.className = 'day-task';
      if (t.done) div.classList.add('completed');
  
      
      const text = document.createElement('span');
      text.textContent = `${t.time || '--:--'} — ${t.text}`;
  
      
      const toggle = document.createElement('button');
      toggle.textContent = t.done ? '✔ Ukończone' : 'Oznacz jako ukończone';
  
      toggle.onclick = () => {
        t.done = !t.done;
        saveTasks();
        renderTasks();
        showTasksForDay(dateStr);
      };
  
      
      div.appendChild(text);
      div.appendChild(toggle);
  
      dayTasksBox.appendChild(div);
    });
  }

  prevMonthBtn.onclick=()=>{ currentDate.setMonth(currentDate.getMonth()-1); renderCalendar(); };
  nextMonthBtn.onclick=()=>{ currentDate.setMonth(currentDate.getMonth()+1); renderCalendar(); };

  geoBtn.onclick=()=>{
    if(!navigator.geolocation){ geoOutput.textContent='Geolokalizacja nie jest wspierana'; return; }
    navigator.geolocation.getCurrentPosition(async pos=>{
      const {latitude,longitude}=pos.coords;
      try{
        const res=await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=pl`);
        const data=await res.json();
        geoOutput.textContent=`${data.address.city||data.address.town||'Nieznane miasto'}, ${data.address.suburb||data.address.county||'Nieznany rejon'}`;
      }catch{ geoOutput.textContent='Nie udało się pobrać lokalizacji.'; }
    }, err=>{ geoOutput.textContent=err.code===1?'Brak zgody':'Błąd geolokalizacji'; });
  };

  notifToggle.checked=notificationsEnabled;
  notifStatus.textContent=notificationsEnabled?'Powiadomienia są włączone':'Powiadomienia są wyłączone';
  notifToggle.addEventListener('change', ()=>{
    notificationsEnabled=notifToggle.checked;
    localStorage.setItem('notifications',JSON.stringify(notificationsEnabled));
    notifStatus.textContent=notificationsEnabled?'Powiadomienia są włączone':'Powiadomienia są wyłączone';
    if(notificationsEnabled && 'Notification' in window){
      Notification.requestPermission().then(p=>{
        if(p==='granted') new Notification('Powiadomienia włączone',{body:'Będziesz otrzymywać powiadomienia o zadaniach',icon:'./favicon.ico'});
      });
    }
  });

  renderTasks();
});