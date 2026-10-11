const within = (slug) => document.querySelector(`[data-guide-demo="${slug}"]`);

const start = within('start');
if (start) {
  const decisions = [
    ['Start with the job', 'A busy person needs to find the next task and act without scanning a dashboard full of accents.', ['One task', 'Two window sizes', 'Clear next action']],
    ['Choose the character', 'Fieldnotes should feel calm and warm. Dusty Coral carries one focal action while routine work stays neutral.', ['Warm', 'Structured', 'One primary family']],
    ['Map semantic tokens', 'Canvas, surface, text, primary action, selection, focus, and error each have a role before they receive a color.', ['Semantic roles', 'Light and dark', 'Contrast checked']],
    ['Adapt the layout', 'The compact view keeps one task column. The wider view adds a detail pane instead of stretching the list.', ['Compact', 'Expanded', 'Same hierarchy']],
    ['Build natively', 'The web uses links, native controls, and browser history. Android uses Material navigation, system bars, and touch behavior.', ['Web behavior', 'Android behavior', 'Shared intent']],
    ['Review the result', 'Check rendered states, focus order, long text, dark mode, keyboard access, and the smallest supported window.', ['Evidence', 'Corrections', 'Known gaps']]
  ];
  start.querySelectorAll('[data-step]').forEach((button) => button.addEventListener('click', () => {
    start.querySelectorAll('[data-step]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    const [title, description, tags] = decisions[Number(button.dataset.step)];
    start.querySelector('[data-step-title]').textContent = title;
    start.querySelector('[data-step-description]').textContent = description;
    start.querySelector('.demo-decision-meta').replaceChildren(...tags.map((tag) => {
      const span = document.createElement('span');
      span.textContent = tag;
      return span;
    }));
  }));
}

const adaptive = within('adaptive-layout');
if (adaptive) {
  const range = adaptive.querySelector('#demo-viewport-width');
  const frame = adaptive.querySelector('[data-adaptive-frame]');
  const output = adaptive.querySelector('#demo-width-output');
  const mode = adaptive.querySelector('[data-adaptive-mode]');
  const update = () => {
    frame.style.width = `${range.value}px`;
    requestAnimationFrame(() => {
      output.value = `${frame.clientWidth} px`;
      mode.textContent = frame.clientWidth >= 500 ? 'Expanded · detail pane' : 'Compact · task list';
    });
  };
  range.addEventListener('input', update);
  window.addEventListener('resize', update);
  update();
}

const components = within('components');
if (components) {
  const title = components.querySelector('[data-component-title]');
  const description = components.querySelector('[data-component-description]');
  const status = components.querySelector('[data-component-status]');
  const complete = components.querySelector('[data-component-complete]');
  const failure = components.querySelector('[data-component-failure]');
  let pending;
  let done = false;
  const reset = () => {
    clearTimeout(pending);
    done = false;
    failure.checked = false;
    complete.disabled = false;
    complete.textContent = 'Complete task';
    status.textContent = 'Ready to complete.';
    delete status.dataset.tone;
  };
  components.querySelectorAll('[data-task]').forEach((button) => button.addEventListener('click', () => {
    components.querySelectorAll('[data-task]').forEach((item) => {
      const selected = item === button;
      item.setAttribute('aria-pressed', String(selected));
      item.querySelector('small').textContent = selected ? 'Selected' : 'Choose';
    });
    title.textContent = button.querySelector('span').textContent;
    description.textContent = button.dataset.task === 'brief' ? 'Confirm the task and move it forward.' : 'Check the layout at compact and wide widths.';
    reset();
  }));
  complete.addEventListener('click', () => {
    if (done) return;
    complete.disabled = true;
    complete.textContent = 'Working…';
    status.textContent = 'Completing task…';
    delete status.dataset.tone;
    pending = setTimeout(() => {
      if (failure.checked) {
        failure.checked = false;
        complete.disabled = false;
        complete.textContent = 'Retry completion';
        status.textContent = 'Could not complete the task. Try again.';
        status.dataset.tone = 'error';
      } else {
        done = true;
        complete.textContent = 'Completed';
        status.textContent = `${title.textContent} completed.`;
      }
    }, 500);
  });
  components.querySelector('[data-component-reset]').addEventListener('click', reset);
}

const forms = within('forms');
if (forms) {
  const createForm = forms.querySelector('[data-create-form]');
  const newTask = forms.querySelector('#demo-new-task');
  const createError = forms.querySelector('[data-create-error]');
  const taskList = forms.querySelector('[data-task-list]');
  const renameInput = forms.querySelector('#demo-rename-task');
  const renameStatus = forms.querySelector('[data-rename-status]');
  const renameRetry = forms.querySelector('[data-rename-retry]');
  const failure = forms.querySelector('[data-form-failure]');
  const scheduleForm = forms.querySelector('[data-schedule-form]');
  const startTime = forms.querySelector('#demo-start-time');
  const endTime = forms.querySelector('#demo-end-time');
  const scheduleStatus = forms.querySelector('[data-schedule-status]');
  const checklistInput = forms.querySelector('#demo-checklist-input');
  const checklist = forms.querySelector('[data-checklist-items]');
  const checklistStatus = forms.querySelector('[data-checklist-status]');
  let savedName = 'Shape the workspace';
  let renameTimer;
  const setRenameStatus = (message, error = false) => {
    renameStatus.textContent = message;
    if (error) renameStatus.dataset.tone = 'error';
    else delete renameStatus.dataset.tone;
  };
  const commitRename = () => {
    clearTimeout(renameTimer);
    const draft = renameInput.value.trim();
    if (!draft) {
      renameInput.setAttribute('aria-invalid', 'true');
      setRenameStatus('A task name is required. The draft is still here.', true);
      renameRetry.hidden = true;
      return;
    }
    renameInput.removeAttribute('aria-invalid');
    if (draft === savedName) {
      setRenameStatus(`Saved: ${savedName}`);
      renameRetry.hidden = true;
      return;
    }
    if (failure.checked) {
      failure.checked = false;
      setRenameStatus('Save failed. Your typed name is still here.', true);
      renameRetry.hidden = false;
      return;
    }
    savedName = draft;
    taskList.firstElementChild.textContent = savedName;
    setRenameStatus(`Saved: ${savedName}`);
    renameRetry.hidden = true;
  };
  createForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const draft = newTask.value.trim();
    if (!draft) {
      newTask.setAttribute('aria-invalid', 'true');
      createError.textContent = 'Enter a task name before adding it.';
      newTask.focus();
      return;
    }
    newTask.removeAttribute('aria-invalid');
    createError.textContent = '';
    const item = document.createElement('li');
    item.textContent = draft;
    taskList.append(item);
    newTask.value = '';
    newTask.focus();
  });
  newTask.addEventListener('input', () => {
    if (newTask.value.trim()) {
      newTask.removeAttribute('aria-invalid');
      createError.textContent = '';
    }
  });
  renameInput.addEventListener('input', () => {
    clearTimeout(renameTimer);
    renameRetry.hidden = true;
    renameInput.removeAttribute('aria-invalid');
    setRenameStatus('Unsaved draft…');
    if (renameInput.value.trim()) renameTimer = setTimeout(commitRename, 900);
  });
  renameInput.addEventListener('blur', commitRename);
  renameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      renameInput.blur();
    }
  });
  renameRetry.addEventListener('click', commitRename);
  for (const input of [startTime, endTime]) input.addEventListener('input', () => {
    input.removeAttribute('aria-invalid');
    scheduleStatus.textContent = 'Unsaved schedule changes.';
    delete scheduleStatus.dataset.tone;
  });
  scheduleForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!startTime.value || !endTime.value || startTime.value >= endTime.value) {
      startTime.setAttribute('aria-invalid', 'true');
      endTime.setAttribute('aria-invalid', 'true');
      scheduleStatus.textContent = 'End time must be later than start time. Nothing was saved.';
      scheduleStatus.dataset.tone = 'error';
      return;
    }
    startTime.removeAttribute('aria-invalid');
    endTime.removeAttribute('aria-invalid');
    scheduleStatus.textContent = `Focus block saved: ${startTime.value}–${endTime.value}.`;
    delete scheduleStatus.dataset.tone;
  });
  const commitChecklist = () => {
    const draft = checklistInput.value.trim();
    if (!draft) {
      checklistStatus.textContent = `${checklist.children.length} saved item${checklist.children.length === 1 ? '' : 's'} · blank row stays a draft.`;
      return;
    }
    const item = document.createElement('li');
    item.textContent = draft;
    checklist.append(item);
    checklistInput.value = '';
    checklistStatus.textContent = `${checklist.children.length} saved items · next row blank.`;
  };
  checklistInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitChecklist();
    }
  });
  checklistInput.addEventListener('blur', commitChecklist);
  forms.querySelector('[data-form-reset]').addEventListener('click', () => {
    clearTimeout(renameTimer);
    taskList.replaceChildren();
    const firstTask = document.createElement('li');
    firstTask.textContent = 'Shape the workspace';
    taskList.append(firstTask);
    newTask.value = '';
    newTask.removeAttribute('aria-invalid');
    createError.textContent = '';
    savedName = 'Shape the workspace';
    renameInput.value = savedName;
    renameInput.removeAttribute('aria-invalid');
    setRenameStatus(`Saved: ${savedName}`);
    renameRetry.hidden = true;
    failure.checked = false;
    startTime.value = '09:00';
    endTime.value = '10:00';
    startTime.removeAttribute('aria-invalid');
    endTime.removeAttribute('aria-invalid');
    scheduleStatus.textContent = 'Not saved yet.';
    delete scheduleStatus.dataset.tone;
    checklist.replaceChildren();
    const firstItem = document.createElement('li');
    firstItem.textContent = 'Review the brief';
    checklist.append(firstItem);
    checklistInput.value = '';
    checklistStatus.textContent = '1 saved item · next row blank.';
  });
}

const example = within('example');
if (example) {
  const retry = example.querySelector('[data-example-retry]');
  const states = {
    ready: ['Shape the workspace', 'Review the layout and choose the next useful step.', 'In progress'],
    empty: ['Nothing needs attention', 'New tasks will appear here when there is work to review.', 'All clear'],
    loading: ['Loading today’s tasks', 'The task list is being prepared.', 'Loading…'],
    error: ['Tasks could not load', 'Check the connection and try again. Your work is still here.', 'Retry available']
  };
  const selectState = (button) => {
    example.querySelectorAll('[data-example-state]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    const [title, copy, indicator] = states[button.dataset.exampleState];
    for (const suffix of ['', '-mobile']) {
      example.querySelector(`[data-example${suffix}-title]`).textContent = title;
      example.querySelector(`[data-example${suffix}-copy]`).textContent = copy;
      const badge = example.querySelector(`[data-example${suffix}-indicator]`);
      badge.textContent = indicator;
      if (button.dataset.exampleState === 'error') badge.dataset.tone = 'error';
      else delete badge.dataset.tone;
    }
    retry.hidden = button.dataset.exampleState !== 'error';
  };
  example.querySelectorAll('[data-example-state]').forEach((button) => button.addEventListener('click', () => selectState(button)));
  retry.addEventListener('click', () => selectState(example.querySelector('[data-example-state="ready"]')));
}

const review = within('review');
if (review) {
  const scene = review.querySelector('[data-review-scene]');
  const error = review.querySelector('[data-review-error]');
  const retry = review.querySelector('[data-review-retry]');
  const open = review.querySelector('.review-preview .demo-color-action');
  const note = review.querySelector('[data-review-note]');
  const notes = {
    normal: 'Now inspect focus, contrast, and the next useful action.',
    large: 'Does every line reflow, and is the action still reachable?',
    error: 'The error needs words and a usable recovery path, not only a red tint.'
  };
  const selectState = (button) => {
    review.querySelectorAll('[data-review-state]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    scene.dataset.state = button.dataset.reviewState;
    error.hidden = button.dataset.reviewState !== 'error';
    retry.hidden = button.dataset.reviewState !== 'error';
    open.hidden = button.dataset.reviewState === 'error';
    note.textContent = notes[button.dataset.reviewState];
  };
  review.querySelectorAll('[data-review-state]').forEach((button) => button.addEventListener('click', () => selectState(button)));
  retry.addEventListener('click', () => selectState(review.querySelector('[data-review-state="normal"]')));
}
