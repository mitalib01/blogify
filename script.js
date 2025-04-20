const POSTS_KEY = 'blogify_posts';
let posts = loadPosts();
renderPosts();

function loadPosts() {
    const storedPosts = localStorage.getItem(POSTS_KEY);
    return storedPosts ? JSON.parse(storedPosts) : [];
}

function savePosts() {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

function renderPosts() {
    const postListDiv = document.getElementById('post-list');
    postListDiv.innerHTML = '';
    if (posts.length === 0) {
        postListDiv.innerHTML = '<p>No posts yet. Start writing!</p>';
        return;
    }
    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.classList.add('post-card');
        postCard.dataset.postId = post.id;

        const titleElem = document.createElement('h3');
        titleElem.classList.add('post-title');
        titleElem.textContent = post.title;

        const contentElem = document.createElement('p');
        contentElem.classList.add('post-content');
        // Display a snippet of the content
        contentElem.textContent = post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content;

        const metaElem = document.createElement('p');
        metaElem.classList.add('post-meta');
        metaElem.textContent = `Date: ${new Date(post.timestamp).toLocaleString()}${post.author ? ' | Author: ' + post.author : ''}`;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit');
        editButton.onclick = () => editPost(post.id);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete');
        deleteButton.onclick = () => deletePost(post.id);

        postCard.appendChild(titleElem);
        postCard.appendChild(contentElem);
        postCard.appendChild(metaElem);
        postCard.appendChild(editButton);
        postCard.appendChild(deleteButton);

        postListDiv.appendChild(postCard);
    });
}

function addPost() {
    const titleInput = document.getElementById('post-title');
    const contentInput = document.getElementById('post-content');
    const authorInput = document.getElementById('post-author');

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const author = authorInput.value.trim();

    if (title && content) {
        const newPost = {
            id: Date.now(), // Simple unique ID
            title: title,
            content: content,
            timestamp: Date.now(),
            author: author || ''
        };
        posts.push(newPost);
        savePosts();
        renderPosts();

        // Clear the form
        titleInput.value = '';
        contentInput.value = '';
        authorInput.value = '';
    } else {
        alert('Title and content are required.');
    }
}

function editPost(postId) {
    const postToEdit = posts.find(post => post.id === postId);
    if (postToEdit) {
        document.getElementById('edit-title').value = postToEdit.title;
        document.getElementById('edit-content').value = postToEdit.content;
        document.getElementById('edit-post-id').value = postId;

        document.getElementById('new-post-form').classList.add('hidden');
        document.getElementById('edit-post-form').classList.remove('hidden');
    }
}

function updatePost() {
    const editTitleInput = document.getElementById('edit-title');
    const editContentInput = document.getElementById('edit-content');
    const editPostIdInput = document.getElementById('edit-post-id');
    const postId = parseInt(editPostIdInput.value);

    const updatedTitle = editTitleInput.value.trim();
    const updatedContent = editContentInput.value.trim();

    if (updatedTitle && updatedContent) {
        posts = posts.map(post => {
            if (post.id === postId) {
                return { ...post, title: updatedTitle, content: updatedContent, timestamp: Date.now() };
            }
            return post;
        });
        savePosts();
        renderPosts();
        cancelEdit(); // Hide edit form
    } else {
        alert('Title and content cannot be empty.');
    }
}

function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        posts = posts.filter(post => post.id !== postId);
        savePosts();
        renderPosts();
    }
}

function cancelEdit() {
    document.getElementById('new-post-form').classList.remove('hidden');
    document.getElementById('edit-post-form').classList.add('hidden');
}
