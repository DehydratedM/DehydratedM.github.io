/* ==========================================================================
   ADMIN SPECIFIC STYLES
   ========================================================================== */
.admin-control-group {
    margin-bottom: 2rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
}

.admin-control-group h3 {
    color: lightcoral;
    margin-bottom: 1rem;
    font-size: 1.2rem;
}

.admin-carousel-item,
.admin-shop-item {
    background: rgba(0, 0, 0, 0.5);
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
    border-left: 3px solid lightcoral;
}

.admin-control-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.admin-control-row input,
.admin-control-row select,
.admin-control-row textarea {
    flex: 1;
    min-width: 200px;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    color: white;
}

.admin-control-row textarea {
    min-height: 80px;
    resize: vertical;
}

.admin-remove-btn {
    background: rgba(220, 53, 69, 0.2);
    color: #dc3545;
    border: 1px solid #dc3545;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.admin-remove-btn:hover {
    background: #dc3545;
    color: white;
}

.admin-add-btn {
    background: rgba(40, 167, 69, 0.2);
    color: #28a745;
    border: 1px solid #28a745;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    margin-top: 1rem;
}

.admin-add-btn:hover {
    background: #28a745;
    color: white;
}

.admin-tool-btn {
    background: rgba(108, 117, 125, 0.2);
    color: #6c757d;
    border: 1px solid #6c757d;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin: 0.5rem;
    transition: all 0.3s ease;
}

.admin-tool-btn:hover {
    background: #6c757d;
    color: white;
}

/* Editable content indicators */
[data-editable="true"] {
    position: relative;
}

[data-editable="true"]:hover::after {
    content: "✏️";
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(0, 0, 0, 0.5);
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 0.8rem;
    opacity: 0.5;
}

/* Admin login modal */
.admin-instructions {
    margin-top: 2rem;
    padding: 1rem;
    background: rgba(240, 128, 128, 0.1);
    border-radius: 8px;
    font-size: 0.9rem;
}

.admin-instructions strong {
    color: lightcoral;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: wheat;
}

.form-group input {
    width: 100%;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    color: white;
}

.admin-login-btn,
.admin-cancel-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    margin-right: 1rem;
}

.admin-login-btn {
    background: lightcoral;
    color: #000;
    border: none;
}

.admin-login-btn:hover {
    background: #ff7f7f;
}

.admin-cancel-btn {
    background: transparent;
    color: wheat;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.admin-cancel-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}
