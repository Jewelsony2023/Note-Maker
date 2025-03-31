document.addEventListener('DOMContentLoaded', () => {
    const notesGrid = document.getElementById('notes-grid');
    const addNoteBtn = document.getElementById('add-note-btn');
    const modal = document.getElementById('note-modal');
    const noteText = document.getElementById('note-text');
    const saveNoteBtn = document.getElementById('save-note');
    const cancelNoteBtn = document.getElementById('cancel-note');

    // Load notes from localStorage
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let editingNoteId = null;

    // Function to generate random pastel color
    function getRandomPastelColor() {
        const hue = Math.random() * 360;
        return `hsl(${hue}, 70%, 90%)`;
    }

    // Function to format date
    function formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Function to create note element
    function createNoteElement(note) {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.style.backgroundColor = note.color;
        
        const content = document.createElement('div');
        content.className = 'note-content';
        content.textContent = note.text;
        
        const date = document.createElement('div');
        date.className = 'note-date';
        date.textContent = formatDate(note.date);
        
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = `favorite-btn ${note.isFavorite ? 'active' : ''}`;
        favoriteBtn.innerHTML = '<i class="fas fa-star"></i>';
        favoriteBtn.onclick = (e) => {
            e.stopPropagation();
            toggleFavorite(note.id);
        };
        
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
        editBtn.onclick = (e) => {
            e.stopPropagation();
            editNote(note);
        };

        // Add context menu for delete
        noteElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to delete this note?')) {
                deleteNote(note.id);
            }
        });
        
        noteElement.appendChild(content);
        noteElement.appendChild(date);
        noteElement.appendChild(favoriteBtn);
        noteElement.appendChild(editBtn);
        
        return noteElement;
    }

    // Function to save notes to localStorage
    function saveNotes() {
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    // Function to toggle favorite status
    function toggleFavorite(noteId) {
        const note = notes.find(n => n.id === noteId);
        if (note) {
            note.isFavorite = !note.isFavorite;
            saveNotes();
            renderNotes();
        }
    }

    // Function to edit note
    function editNote(note) {
        editingNoteId = note.id;
        noteText.value = note.text;
        modal.style.display = 'block';
    }

    // Function to delete note
    function deleteNote(noteId) {
        notes = notes.filter(note => note.id !== noteId);
        saveNotes();
        renderNotes();
    }

    // Function to render all notes
    function renderNotes() {
        notesGrid.innerHTML = '';
        notes.forEach(note => {
            notesGrid.appendChild(createNoteElement(note));
        });
    }

    // Event listeners
    addNoteBtn.addEventListener('click', () => {
        editingNoteId = null;
        noteText.value = '';
        modal.style.display = 'block';
    });

    cancelNoteBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        editingNoteId = null;
    });

    saveNoteBtn.addEventListener('click', () => {
        if (noteText.value.trim()) {
            if (editingNoteId) {
                // Update existing note
                const noteIndex = notes.findIndex(n => n.id === editingNoteId);
                if (noteIndex !== -1) {
                    notes[noteIndex].text = noteText.value.trim();
                    notes[noteIndex].date = new Date();
                }
            } else {
                // Create new note
                const newNote = {
                    id: Date.now(),
                    text: noteText.value.trim(),
                    date: new Date(),
                    color: getRandomPastelColor(),
                    isFavorite: false
                };
                notes.push(newNote);
            }
            
            saveNotes();
            renderNotes();
            modal.style.display = 'none';
            editingNoteId = null;
        }
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            editingNoteId = null;
        }
    });

    // Initial render
    renderNotes();
}); 