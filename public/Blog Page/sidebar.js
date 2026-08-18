const loadSidebar = () => {
    const sidebarContainer = document.querySelector(".sidebar");
    if (!sidebarContainer) return;

    sidebarContainer.innerHTML = `
        <div class="flex flex-col justify-start w-full md:w-[340px] bg-[var(--panel-bg)] border border-[var(--panel-border)] p-5 md:p-6 rounded-[var(--radius-card)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] h-fit backdrop-blur-[var(--glass-blur)] -webkit-backdrop-blur-[var(--glass-blur)] style="box-sizing:border-box;min-width:0;">
            
            <!-- Global Action Metrics Widget -->
            <div class="flex flex-row gap-8 justify-center items-center h-16 border-b border-[var(--panel-border)] mb-6 text-[var(--text-muted)]">
                <p class="cursor-pointer hidden transition-transform duration-300 hover:scale-110 hover:text-[#ef4444]" id="liked">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                        <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                    </svg>
                </p>
                <p class="cursor-pointer transition-transform duration-300 hover:scale-110 hover:text-[#ef4444]" id="like">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                    </svg>
                </p>
                <p class="cursor-pointer transition-transform duration-300 hover:scale-110 hover:text-[var(--primary)]" id="share">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                    </svg>
                </p>
                <p class="cursor-pointer transition-transform duration-300 hover:scale-110 hover:text-[var(--primary)]" id="bookmark">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                    </svg>
                </p>
                <p class="cursor-pointer hidden transition-transform duration-300 hover:scale-110 hover:text-[var(--primary)]" id="bookmarked">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5" />
                    </svg>
                </p>
            </div>

            <!-- Global Search Architecture -->
            <div class="mb-8">
                <h2 class="text-[var(--text-main)] text-xl font-bold mb-4 tracking-tight">Search Articles</h2>
                <div class="input-capsule-wrapper">
                    <input type="text" placeholder="Search..." class="sidebar-search" id="sidebarSearch" />
                    <button class="search-btn" onclick="searchBlogs()">🔍</button>
                </div>
            </div>

            <!-- Taxonomies & Categories Matrix -->
            <div class="mb-8">
                <h2 class="text-[var(--text-main)] text-xl font-bold mb-4 tracking-tight">Categories</h2>
                <div class="flex flex-col gap-3">
                    <div class="category-item flex justify-between items-center text-[var(--text-main)] font-semibold text-sm hover:translate-x-1 cursor-pointer transition-all duration-300">
                        <span>🌿 Agriculture</span>
                        <span class="category-count">0</span>
                    </div>
                    <div class="category-item flex justify-between items-center text-[var(--text-main)] font-semibold text-sm hover:translate-x-1 cursor-pointer transition-all duration-300">
                        <span>💻 Technology</span>
                        <span class="category-count">0</span>
                    </div>
                    <div class="category-item flex justify-between items-center text-[var(--text-main)] font-semibold text-sm hover:translate-x-1 cursor-pointer transition-all duration-300">
                        <span>💚 Lifestyle</span>
                        <span class="category-count">0</span>
                    </div>
                    <div class="category-item flex justify-between items-center text-[var(--text-main)] font-semibold text-sm hover:translate-x-1 cursor-pointer transition-all duration-300">
                        <span>🧑‍💻 Development</span>
                        <span class="category-count">0</span>
                    </div>
                    <div class="category-item flex justify-between items-center text-[var(--text-main)] font-semibold text-sm hover:translate-x-1 cursor-pointer transition-all duration-300">
                        <span>✈ Travel</span>
                        <span class="category-count">0</span>
                    </div>
                </div>
                <a href="#" class="view-all">View All Categories →</a>
            </div>

            <!-- Email Capture Engine -->
            <div class="mb-8">
                <h2 class="text-[var(--text-main)] text-xl font-bold mb-3 tracking-tight">Subscribe to Newsletter</h2>
                <p class="newsletter-text">Get the latest articles straight to your inbox.</p>
                <div class="input-capsule-wrapper">
                    <input type="email" placeholder="Your email address" class="newsletter-input" />
                    <button class="subscribe-btn">Subscribe</button>
                </div>
            </div>

            <!-- Dynamic Stream Engine (Comments Stack) -->
            <div class="w-full flex flex-col">
                <h2 class="text-[var(--text-main)] text-xl font-bold mb-4 tracking-tight">Comments</h2>
                <div class="w-full flex flex-col gap-3">
                    <input type="text" id="username" placeholder="Your Name" class="w-full padding-[12px_16px] border border-[var(--panel-border)] rounded-xl outline-none font-medium text-sm text-[var(--text-main)] bg-[rgba(248,250,252,0.6)] focus:border-[var(--primary)] focus:bg-[var(--bg-panel)] focus:ring-4 focus:ring-[var(--primary-glow)] transition-all duration-300" style="padding: 12px 16px;" />
                    <textarea name="comment" id="comment" placeholder="Add a comment ..." class="w-full min-h-[100px] padding-[12px_16px] border border-[var(--panel-border)] rounded-xl outline-none text-sm text-[var(--text-main)] bg-[rgba(248,250,252,0.6)] focus:border-[var(--primary)] focus:bg-[var(--bg-panel)] focus:ring-4 focus:ring-[var(--primary-glow)] resize-none transition-all duration-300" style="padding: 12px 16px;"></textarea>
                    <button type="submit" class="self-end bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-2 px-6 rounded-xl font-bold text-sm shadow-[0_4px_12px_var(--primary-glow)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300" onclick="addComment()"> Submit </button>
                </div>
                <div id="comments" class="mt-6 text-[var(--text-muted)] flex flex-col gap-4 max-h-[320px] overflow-y-auto pr-1">
                    <p id="emptyMessage" class="text-center text-sm font-medium opacity-80 py-4">No comments yet</p>
                </div>
            </div>
        </div>
    `;
};

// Immediate instantiation layout synchronization block
loadSidebar();