const apiUrl = '/api/items';
const itemList = document.getElementById('item-list');
const itemForm = document.getElementById('item-form');
const message = document.getElementById('message');

async function fetchItems() {
  try {
    const response = await fetch(apiUrl);
    const items = await response.json();
    renderItems(items);
  } catch (error) {
    showMessage('Unable to load items. Check the server and try again.', true);
  }
}

function renderItems(items) {
  itemList.innerHTML = items.length
    ? items.map(createItemHtml).join('')
    : '<li class="empty">No items found. Add one above.</li>';
}

function createItemHtml(item) {
  return `
    <li class="item-card" data-id="${item.id}">
      <div class="item-content">
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.description || '')}</p>
        </div>
        <div class="item-actions">
          <button type="button" data-action="toggle">${item.completed ? 'Mark Incomplete' : 'Mark Complete'}</button>
          <button type="button" data-action="edit">Edit</button>
          <button type="button" data-action="delete">Delete</button>
        </div>
      </div>
    </li>
  `;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function createItem(data) {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Create failed');
  }

  return response.json();
}

async function updateItem(id, data) {
  const response = await fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Update failed');
  }

  return response.json();
}

async function deleteItem(id) {
  const response = await fetch(`${apiUrl}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Delete failed');
  }

  return response.json();
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.className = `message ${isError ? 'error' : 'success'}`;
  setTimeout(() => {
    message.textContent = '';
    message.className = 'message';
  }, 3000);
}

itemForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();

  if (!title) {
    showMessage('Title is required.', true);
    return;
  }

  try {
    await createItem({ title, description, completed: false });
    itemForm.reset();
    await fetchItems();
    showMessage('Item created successfully.');
  } catch (error) {
    showMessage('Unable to create item.', true);
  }
});

itemList.addEventListener('click', async (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  const itemCard = button.closest('li[item-id], li');
  const itemId = itemCard?.dataset.id;
  if (!itemId) return;

  if (action === 'delete') {
    if (!confirm('Delete this item?')) return;
    try {
      await deleteItem(itemId);
      await fetchItems();
      showMessage('Item deleted successfully.');
    } catch (error) {
      showMessage('Unable to delete item.', true);
    }
    return;
  }

  if (action === 'toggle' || action === 'edit') {
    const listItems = document.querySelectorAll('#item-list .item-card');
    const cards = Array.from(listItems);
    const item = cards.find((card) => card.dataset.id === itemId);
    if (!item) return;

    const title = item.querySelector('strong').textContent;
    const description = item.querySelector('p').textContent;
    const completed = action === 'toggle' ? !button.textContent.includes('Incomplete') : undefined;

    if (action === 'edit') {
      const newTitle = prompt('New title', title);
      if (newTitle === null) return;
      const newDescription = prompt('New description', description);
      try {
        await updateItem(itemId, {
          title: newTitle.trim() || title,
          description: newDescription === null ? description : newDescription.trim(),
        });
        await fetchItems();
        showMessage('Item updated successfully.');
      } catch (error) {
        showMessage('Unable to update item.', true);
      }
      return;
    }

    try {
      await updateItem(itemId, { title, description, completed });
      await fetchItems();
      showMessage('Item status updated.');
    } catch (error) {
      showMessage('Unable to update item.', true);
    }
  }
});

fetchItems();
