import React from "react";

function HomePage() {
    document.addEventListener('DOMContentLoaded', () => {
            // Navbar js
            var toggleOpen = document.getElementById('toggleOpen');
            var toggleClose = document.getElementById('toggleClose');
            var collapseMenu = document.getElementById('collapseMenu');

            function handleClick() {
                if (collapseMenu.style.display === 'block') {
                    collapseMenu.style.display = 'none';
                } else {
                    collapseMenu.style.display = 'block';
                }
            }

            toggleOpen.addEventListener('click', handleClick);
            toggleClose.addEventListener('click', handleClick);

            // FAQ js
            document.querySelectorAll('.accordion').forEach(elm => {
                const button = elm.querySelector('.toggle-button');
                const content = elm.querySelector('.content');
                const plusIcon = button.querySelector('.plus');

                button.addEventListener('click', () => {
                    const isHidden = content.classList.toggle('invisible');
                    content.style.maxHeight = isHidden ? '0px' : `${content.scrollHeight + 100}px`;
                    content.classList.toggle('pb-4', !isHidden);
                    plusIcon.classList.toggle('hidden', !isHidden);
                    plusIcon.classList.toggle('block', isHidden);
                });
            });

            // scroll
            document.querySelectorAll("a[href^='#']").forEach(anchor => {
                anchor.addEventListener("click", function (e) {
                    e.preventDefault();

                    const targetId = this.getAttribute("href");
                    const target = document.querySelector(targetId);
                    const offset = 70; // control scroll position

                    if (target) {
                        window.scrollTo({
                            top: target.offsetTop - offset,
                            behavior: "smooth"
                        });
                    }
                });
            });

        });
  return (
  <div>

<div className="max-w-[1920px] mx-auto">
    <div className="bg-white text-slate-900 text-[15px]">
        {/* <!-- navbar --> */}
        <header className="sticky top-0 flex shadow-md py-2 px-4 sm:px-10 bg-white min-h-[70px] tracking-wide z-50">
            <div className="flex flex-wrap items-center justify-between gap-5 w-full">
                <a href="#" className="max-sm:hidden"><img src="https://readymadeui.com/readymadeui.svg"
                        alt="logo" className="w-36" /></a>
                <a href="#" className="hidden max-sm:block"><img
                        src="https://readymadeui.com/readymadeui-short.svg" alt="logo" className="w-9" /></a>

                <div id="collapseMenu"
                    className="max-xl:hidden xl:!block max-xl:before:fixed max-xl:before:bg-black max-xl:before:opacity-50 max-xl:before:inset-0 max-xl:before:z-50">
                    <button id="toggleClose"
                        className="xl:hidden cursor-pointer fixed top-2 right-4 z-[100] rounded-full bg-white w-9 h-9 flex items-center justify-center border">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 fill-black"
                            viewBox="0 0 320.591 320.591">
                            <path
                                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                                data-original="#000000"></path>
                            <path
                                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                                data-original="#000000"></path>
                        </svg>
                    </button>

                    <ul
                        className="xl:flex gap-x-5 max-xl:space-y-3 max-xl:fixed max-xl:bg-white max-xl:w-1/2 max-xl:min-w-[300px] max-xl:top-0 max-xl:left-0 max-xl:p-6 max-xl:h-full max-xl:shadow-md max-xl:overflow-auto z-50">
                        <li className="mb-6 hidden max-xl:block">
                            <a href="#"><img src="https://readymadeui.com/readymadeui.svg" alt="logo"
                                    className="w-36" />
                            </a>
                        </li>
                        <li className="max-xl:border-b max-xl:border-gray-300 max-xl:py-3 px-3">
                            <a href='#features' className="hover:text-blue-700 block font-medium">Features</a>
                        </li>
                        <li className="max-xl:border-b max-xl:border-gray-300 max-xl:py-3 px-3">
                            <a href='#how-it-works' className="hover:text-blue-700 block font-medium">How Works</a>
                        </li>
                        <li className="max-xl:border-b max-xl:border-gray-300 max-xl:py-3 px-3">
                            <a href='#integrations' className="hover:text-blue-700 block font-medium">Integrations</a>
                        </li>
                        <li className="max-xl:border-b max-xl:border-gray-300 max-xl:py-3 px-3">
                            <a href='#pricing' className="hover:text-blue-700 block font-medium">Pricing</a>
                        </li>
                        <li className="max-xl:border-b max-xl:border-gray-300 max-xl:py-3 px-3">
                            <a href='#testimonials' className="hover:text-blue-700 block font-medium">Testimonials</a>
                        </li>
                        <li className="max-xl:border-b max-xl:border-gray-300 max-xl:py-3 px-3">
                            <a href='#faq' className="hover:text-blue-700 block font-medium">Faq</a>
                        </li>
                    </ul>
                </div>

                <div className="flex max-xl:ml-auto gap-4">
                    <button
                        className="px-4 py-2.5 rounded-lg font-medium cursor-pointer tracking-wide text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all">Get
                        started</button>

                    <button id="toggleOpen" className="xl:hidden cursor-pointer">
                        <svg className="w-7 h-7" fill="#000" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </header>

        <div>
            {/* <!-- Hero Section --> */}
            <div className="xl:min-h-[500px] bg-blue-50 px-4 sm:px-10 py-10">
                <div className="grid xl:grid-cols-2 justify-center items-center gap-10">
                    <div>
                        <div className="max-w-3xl max-xl:mx-auto max-xl:text-center">
                            <p className="mb-2 font-semibold text-blue-600"><span
                                    className="rotate-90 inline-block mr-2">|</span> ALL IN ONE MEETING SCHEDULER</p>
                            <h1 className="md:text-5xl text-4xl font-bold md:!leading-[55px]">Schedule meetings effortlessly
                            </h1>
                            <p className="text-base leading-relaxed mt-6">Eliminate back-and-forth emails
                                with our intelligent scheduling platform. Share your availability, let clients book
                                instantly, and connect with automatic calendar integration. Streamline your workflow and
                                focus on what matters most - your meetings, not managing them.</p>

                            <div
                                className="bg-white shadow-sm border border-gray-200 mt-12 flex px-1 py-1.5 rounded-lg overflow-hidden max-xl:max-w-xl max-xl:mx-auto">
                                <input type='email' placeholder='Enter your email address'
                                    className="w-full outline-none bg-white px-4" />
                                <div className="ml-auto sm:min-w-[200px] min-w-[120px]">
                                    <button type='button'
                                        className="bg-blue-600 hover:bg-blue-700 cursor-pointer transition-all text-white font-medium rounded-lg px-4 py-2.5 block ml-auto">Start
                                        Free</button>
                                </div>
                            </div>
                        </div>

                        <section className="mt-12">
                            <div className="container mx-auto">
                                <div className="grid min-[450px]:grid-cols-2 md:grid-cols-3 gap-8 text-center">
                                    <div>
                                        <h3 className="text-3xl font-semibold text-blue-600">3M+</h3>
                                        <p className="mt-3 font-medium text-base">Meetings Scheduled</p>
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-semibold text-blue-600">50K+</h3>
                                        <p className="mt-3 font-medium text-base">Active Users</p>
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-semibold text-blue-600">99.9%</h3>
                                        <p className="mt-3 font-medium text-base">Uptime</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>

                    <div className="xl:aspect-[350/251]">
                        <img src="https://readymadeui.com/images/meeting-img.webp" alt="banner img"
                            className="w-full h-full object-contain max-xl:object-top" />
                    </div>
                </div>
            </div>

            {/* <!-- Features Section --> */}
            <div id="features"
                className="md:mt-28 mt-16 py-16 bg-gradient-to-t from-gray-200 via-gray-50 to-gray-200 px-4 sm:px-10">
                <div className="container mx-auto">
                    <div className="text-center max-w-4xl mx-auto">
                        <p className="text-blue-600 font-semibold mb-2">POWERFUL FEATURES</p>
                        <h2 className="text-2xl md:text-3xl font-bold leading-relaxed">Everything you need to schedule with
                            confidence</h2>
                        <div className="max-w-2xl mx-auto mt-6">
                            <p className="leading-relaxed">Our comprehensive platform offers all the
                                tools you need to
                                streamline your scheduling process and boost productivity.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
                        <div
                            className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600 fill-current"
                                    viewBox="0 0 682.667 682.667">
                                    <defs>
                                        <clipPath id="a" clipPathUnits="userSpaceOnUse">
                                            <path d="M0 512h512V0H0Z" data-original="#000000" />
                                        </clipPath>
                                    </defs>
                                    <g clipPath="url(#a)" transform="matrix(1.33333 0 0 -1.33333 0 682.667)">
                                        <path fill="none" stroke="currentColor" strokeLinecap="round"
                                            strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="40"
                                            d="M236.333 118h39.333m78.895 0h39.333m-275.561 0h39.333m78.667 118h39.333m78.895 0h39.333m-275.561 0h39.333M20 334.667h472.227M98.894 20h314.439c43.572 0 78.894 35.322 78.894 78.895v274.877c0 43.572-35.322 78.895-78.894 78.895H98.894C55.322 452.667 20 417.344 20 373.772V98.895C20 55.322 55.322 20 98.894 20zm275.333 373.667V492M138 393.667V492"
                                            data-original="#000000" />
                                    </g>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Calendar Integration</h3>
                            <p className="leading-relaxed">Seamlessly sync with Google, Outlook, Apple, and
                                other calendar platforms to
                                prevent double-booking.</p>
                        </div>

                        <div
                            className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-blue-600"
                                    viewBox="0 0 64 64">
                                    <path
                                        d="M32 63.5A31.5 31.5 0 1 1 63.5 32a2.1 2.1 0 0 1-4.2 0A27.3 27.3 0 1 0 32 59.3a2.1 2.1 0 0 1 0 4.2z"
                                        data-original="#000000" />
                                    <path
                                        d="M56.15 19.4H7.85a2.1 2.1 0 0 1 0-4.2h48.3a2.1 2.1 0 0 1 0 4.2zM32 34.1H2.6a2.1 2.1 0 0 1 0-4.2H32a2.1 2.1 0 0 1 0 4.2zm-6.3 14.7H7.85a2.1 2.1 0 0 1 0-4.2H25.7a2.1 2.1 0 0 1 0 4.2z"
                                        data-original="#000000" />
                                    <path
                                        d="M32 63.5c-8.832 0-15.75-13.837-15.75-31.5S23.168.5 32 .5c7.59 0 13.935 10.275 15.426 24.99a2.1 2.1 0 0 1-4.18.42C42.022 13.82 37.186 4.7 32 4.7c-5.46 0-11.55 11.212-11.55 27.3S26.54 59.3 32 59.3a2.1 2.1 0 0 1 0 4.2z"
                                        data-original="#000000" />
                                    <path
                                        d="M46.7 63.5a16.8 16.8 0 1 1 16.8-16.8 16.82 16.82 0 0 1-16.8 16.8zm0-29.4a12.6 12.6 0 1 0 12.6 12.6 12.614 12.614 0 0 0-12.6-12.6z"
                                        data-original="#000000" />
                                    <path
                                        d="M43.55 51.95a2.1 2.1 0 0 1-1.485-3.585l2.535-2.534V38.3a2.1 2.1 0 0 1 4.2 0v8.4a2.1 2.1 0 0 1-.615 1.485l-3.15 3.15a2.092 2.092 0 0 1-1.485.615z"
                                        data-original="#000000" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Time Zone Intelligence</h3>
                            <p className="leading-relaxed">Automatically detect and adjust to client time
                                zones to avoid scheduling
                                confusion.</p>
                        </div>

                        <div
                            className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-blue-600"
                                    fillRule="evenodd" viewBox="0 0 24 24">
                                    <path
                                        d="M21.99 7.68v8.64a1.352 1.352 0 0 1-1.35 1.35H3.36a1.352 1.352 0 0 1-1.35-1.35V4.44a1.352 1.352 0 0 1 1.35-1.35h8.1a.81.81 0 0 0 0-1.62h-8.1c-.787 0-1.543.313-2.1.87a2.975 2.975 0 0 0-.87 2.1v11.88c0 .787.313 1.543.87 2.1a2.975 2.975 0 0 0 2.1.87h17.28c.787 0 1.543-.313 2.1-.87a2.975 2.975 0 0 0 .87-2.1V7.68a.81.81 0 0 0-1.62 0z"
                                        data-original="#000000" />
                                    <path
                                        d="M20.91 4.44V2.28c0-.501-.199-.982-.554-1.336A1.886 1.886 0 0 0 19.02.39H14.7c-.501 0-.982.199-1.336.554a1.886 1.886 0 0 0-.554 1.336v2.16c0 .501.199.982.554 1.336.354.355.835.554 1.336.554h4.32c.501 0 .982-.199 1.336-.554.355-.354.554-.835.554-1.336zm-1.62 0a.27.27 0 0 1-.27.27H14.7a.27.27 0 0 1-.27-.27V2.28a.27.27 0 0 1 .27-.27h4.32a.27.27 0 0 1 .27.27z"
                                        data-original="#000000" />
                                    <path
                                        d="M23.61 4.722V1.998A1.352 1.352 0 0 0 21.759.744l-1.96.784a.81.81 0 0 0-.509.752v2.16a.81.81 0 0 0 .509.752l1.96.784a1.352 1.352 0 0 0 1.851-1.254zm-1.62-2.325v1.926l-1.08-.432V2.83zm-6.342 15.827a.81.81 0 0 0-.768-.554H9.12a.81.81 0 0 0-.768.554l-1.441 4.32a.812.812 0 0 0 .769 1.066h8.64a.81.81 0 0 0 .769-1.066zm-1.352 1.066.9 2.7H8.804l.9-2.7z"
                                        data-original="#000000" />
                                    <path
                                        d="M6.06 23.61h11.88a.81.81 0 0 0 0-1.62H6.06a.81.81 0 0 0 0 1.62zm9.45-9.475c0-.714-.404-1.41-1.188-1.945-.89-.607-2.322-1.025-3.942-1.025s-3.052.418-3.942 1.025c-.784.535-1.188 1.231-1.188 1.945v.659a1.239 1.239 0 0 0 1.242 1.242h7.776a1.24 1.24 0 0 0 1.242-1.242zm-1.62.281H6.87v-.28c0-.243.214-.426.48-.608.682-.464 1.79-.743 3.03-.743s2.348.279 3.03.743c.266.182.48.365.48.607z"
                                        data-original="#000000" />
                                    <path
                                        d="M10.38 5.997a2.971 2.971 0 1 0 2.97 2.97 2.972 2.972 0 0 0-2.97-2.97zm0 1.62a1.351 1.351 0 0 1 0 2.7 1.35 1.35 0 0 1 0-2.7z"
                                        data-original="#000000" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Video Meeting Links</h3>
                            <p className="leading-relaxed">Auto-generate Zoom, Teams, or Google Meet links
                                for each scheduled meeting.</p>
                        </div>

                        <div
                            className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-blue-600"
                                    viewBox="0 0 371.263 371.263">
                                    <path
                                        d="M305.402 234.794v-70.54c0-52.396-33.533-98.085-79.702-115.151.539-2.695.838-5.449.838-8.204C226.539 18.324 208.215 0 185.64 0s-40.899 18.324-40.899 40.899c0 2.695.299 5.389.778 7.964-15.868 5.629-30.539 14.551-43.054 26.647-23.593 22.755-36.587 53.354-36.587 86.169v73.115c0 2.575-2.096 4.731-4.731 4.731-22.096 0-40.959 16.647-42.995 37.845-1.138 11.797 2.755 23.533 10.719 32.276 7.904 8.683 19.222 13.713 31.018 13.713h72.217c2.994 26.887 25.869 47.905 53.534 47.905s50.54-21.018 53.534-47.905h72.217c11.797 0 23.114-5.03 31.018-13.713 7.904-8.743 11.797-20.479 10.719-32.276-2.036-21.198-20.958-37.845-42.995-37.845a4.704 4.704 0 0 1-4.731-4.731zM185.64 23.952c9.341 0 16.946 7.605 16.946 16.946 0 .778-.12 1.497-.24 2.275-4.072-.599-8.204-1.018-12.336-1.138-7.126-.24-14.132.24-21.078 1.198-.12-.778-.24-1.497-.24-2.275.002-9.401 7.607-17.006 16.948-17.006zm0 323.358c-14.431 0-26.527-10.3-29.342-23.952h58.683c-2.813 13.653-14.909 23.952-29.341 23.952zm143.655-67.665c.479 5.15-1.138 10.12-4.551 13.892-3.533 3.773-8.204 5.868-13.353 5.868H59.89c-5.15 0-9.82-2.096-13.294-5.868-3.473-3.772-5.09-8.743-4.611-13.892.838-9.042 9.282-16.168 19.162-16.168 15.809 0 28.683-12.874 28.683-28.683v-73.115c0-26.228 10.419-50.719 29.282-68.923 18.024-17.425 41.498-26.887 66.528-26.887 1.198 0 2.335 0 3.533.06 50.839 1.796 92.277 45.929 92.277 98.325v70.54c0 15.809 12.874 28.683 28.683 28.683 9.88 0 18.264 7.126 19.162 16.168z"
                                        data-original="#000000" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Smart Reminders</h3>
                            <p className="leading-relaxed">Automated email and SMS reminders to reduce
                                no-shows by up to 80%.</p>
                        </div>

                        <div
                            className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-blue-600"
                                    viewBox="0 0 512 512">
                                    <path
                                        d="M437 268.152h-50.118c-6.821 0-13.425.932-19.71 2.646-12.398-24.372-37.71-41.118-66.877-41.118h-88.59c-29.167 0-54.479 16.746-66.877 41.118a74.798 74.798 0 0 0-19.71-2.646H75c-41.355 0-75 33.645-75 75v80.118c0 24.813 20.187 45 45 45h422c24.813 0 45-20.187 45-45v-80.118c0-41.355-33.645-75-75-75zm-300.295 36.53v133.589H45c-8.271 0-15-6.729-15-15v-80.118c0-24.813 20.187-45 45-45h50.118c4.072 0 8.015.553 11.769 1.572a75.372 75.372 0 0 0-.182 4.957zm208.59 133.589h-178.59v-133.59c0-24.813 20.187-45 45-45h88.59c24.813 0 45 20.187 45 45v133.59zm136.705-15c0 8.271-6.729 15-15 15h-91.705v-133.59a75.32 75.32 0 0 0-.182-4.957 44.899 44.899 0 0 1 11.769-1.572H437c24.813 0 45 20.187 45 45v80.119z"
                                        data-original="#000000" />
                                    <path
                                        d="M100.06 126.504c-36.749 0-66.646 29.897-66.646 66.646-.001 36.749 29.897 66.646 66.646 66.646 36.748 0 66.646-29.897 66.646-66.646s-29.897-66.646-66.646-66.646zm-.001 103.292c-20.207 0-36.646-16.439-36.646-36.646s16.439-36.646 36.646-36.646 36.646 16.439 36.646 36.646-16.439 36.646-36.646 36.646zM256 43.729c-49.096 0-89.038 39.942-89.038 89.038s39.942 89.038 89.038 89.038 89.038-39.942 89.038-89.038c0-49.095-39.942-89.038-89.038-89.038zm0 148.076c-32.554 0-59.038-26.484-59.038-59.038 0-32.553 26.484-59.038 59.038-59.038s59.038 26.484 59.038 59.038c0 32.554-26.484 59.038-59.038 59.038zm155.94-65.301c-36.748 0-66.646 29.897-66.646 66.646.001 36.749 29.898 66.646 66.646 66.646 36.749 0 66.646-29.897 66.646-66.646s-29.897-66.646-66.646-66.646zm0 103.292c-20.206 0-36.646-16.439-36.646-36.646.001-20.207 16.44-36.646 36.646-36.646 20.207 0 36.646 16.439 36.646 36.646s-16.439 36.646-36.646 36.646z"
                                        data-original="#000000" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Group Scheduling</h3>
                            <p className="leading-relaxed">Find the perfect time for multiple participants
                                with our intelligent scheduling
                                algorithm.</p>
                        </div>

                        <div
                            className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-blue-600"
                                    viewBox="0 0 512 512">
                                    <path
                                        d="M30 256C30 131.383 131.383 30 256 30c46.867 0 91.563 14.211 129.196 40.587h-29.074c-8.284 0-15 6.716-15 15s6.716 15 15 15h70.292c8.284 0 15-6.716 15-15V15.295c0-8.284-6.716-15-15-15s-15 6.716-15 15v37.339C366.987 18.499 312.91 0 256 0 187.62 0 123.333 26.629 74.98 74.98 26.629 123.333 0 187.62 0 256c0 44.921 11.871 89.182 34.33 127.998 2.78 4.806 7.818 7.49 12.997 7.49 2.55 0 5.134-.651 7.499-2.019 7.17-4.149 9.619-13.325 5.471-20.496C40.477 334.718 30 295.652 30 256zm447.67-127.998c-4.15-7.171-13.328-9.619-20.496-5.47-7.17 4.149-9.619 13.325-5.471 20.496C471.523 177.281 482 216.346 482 256c0 124.617-101.383 226-226 226-46.863 0-91.551-14.215-129.18-40.587h29.058c8.284 0 15-6.716 15-15s-6.716-15-15-15H85.587c-8.284 0-15 6.716-15 15v70.292c0 8.284 6.716 15 15 15s15-6.716 15-15v-37.376C145.013 493.475 199.083 512 256 512c68.38 0 132.667-26.629 181.02-74.98C485.371 388.667 512 324.38 512 256c0-44.923-11.871-89.184-34.33-127.998z"
                                        data-original="#000000" />
                                    <path
                                        d="M384.413 217.203a14.994 14.994 0 0 0-1.499-11.382l-20-34.641c-4.142-7.174-13.315-9.632-20.49-5.49l-13.602 7.853a108.886 108.886 0 0 0-37.821-21.856V136c0-8.284-6.716-15-15-15h-40c-8.284 0-15 6.716-15 15v15.686a108.89 108.89 0 0 0-37.822 21.856l-13.601-7.853c-7.174-4.144-16.349-1.685-20.49 5.49l-20 34.641c-4.142 7.174-1.684 16.348 5.49 20.49l13.598 7.851c-1.446 7.163-2.176 14.47-2.176 21.838s.729 14.676 2.176 21.838l-13.598 7.851c-7.174 4.142-9.632 13.316-5.49 20.49l20 34.641c4.142 7.175 13.315 9.633 20.49 5.49l13.601-7.853a108.865 108.865 0 0 0 37.822 21.856V376c0 8.284 6.716 15 15 15h40c8.284 0 15-6.716 15-15v-15.686a108.886 108.886 0 0 0 37.821-21.856l13.602 7.853c7.174 4.142 16.348 1.683 20.49-5.49l20-34.641a15.003 15.003 0 0 0 1.499-11.382 14.994 14.994 0 0 0-6.989-9.108l-13.599-7.852C365.271 270.676 366 263.369 366 256s-.729-14.676-2.175-21.838l13.599-7.852a14.995 14.995 0 0 0 6.989-9.107zM256 296c-22.091 0-40-17.909-40-40s17.909-40 40-40 40 17.909 40 40-17.909 40-40 40z"
                                        data-original="#000000" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Custom Integrations</h3>
                            <p className="leading-relaxed">Connect with your favorite tools via Zapier, our
                                API, or native integrations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- How It Works Section --> */}
            <div id="how-it-works" className="md:mt-28 mt-16 px-4 sm:px-10">
                <div className="container mx-auto">
                    <div className="text-center max-w-4xl mx-auto">
                        <p className="text-blue-600 font-semibold mb-2">SIMPLE PROCESS</p>
                        <h2 className="text-2xl md:text-3xl font-bold leading-relaxed">How It Works</h2>
                        <div className="max-w-2xl mx-auto mt-6">
                            <p className="leading-relaxed">Our intuitive platform makes scheduling
                                meetings as simple as 1-2-3.</p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
                        <div className="text-center">
                            <div
                                className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                                1</div>
                            <h3 className="text-lg font-semibold mb-2">Create Your Schedule</h3>
                            <p className="leading-relaxed">Define your availability, meeting types, and
                                durations. Sync with your existing calendars to prevent double-booking.</p>
                        </div>

                        <div className="text-center">
                            <div
                                className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                                2</div>
                            <h3 className="text-lg font-semibold mb-2">Share Your Link</h3>
                            <p className="leading-relaxed">Send your personalized booking link via email,
                                embed it on your website, or add it to your social profiles.</p>
                        </div>

                        <div className="text-center">
                            <div
                                className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                                3</div>
                            <h3 className="text-lg font-semibold mb-2">Meet with Confidence</h3>
                            <p className="leading-relaxed">Clients book available slots, receive automatic
                                confirmations, and both parties get reminders before meetings.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Integrations Section --> */}
            <div id="integrations"
                className="py-16 bg-gradient-to-t from-blue-100 via-blue-50 to-blue-100 md:mt-28 mt-16 px-4 sm:px-10">
                <div className="container mx-auto">
                    <div className="text-center max-w-4xl mx-auto">
                        <p className="text-blue-600 font-semibold mb-2">SEAMLESS CONNECTIONS</p>
                        <h2 className="text-2xl md:text-3xl font-bold leading-relaxed">Integrate with Your Favorite Tools
                        </h2>
                        <div className="max-w-2xl mx-auto mt-6">
                            <p className="leading-relaxed">We connects with the apps you already use,
                                creating a seamless workflow.</p>
                        </div>
                    </div>

                    <div
                        className="grid min-[500px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 items-center mt-16">
                        <div
                            className="p-4 bg-white rounded-lg shadow-sm flex items-center justify-center gap-4 h-24 hover:shadow-md transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0" viewBox="0 0 512 512">
                                <path fill="#0085f7"
                                    d="M176.539 330.307c-10.072-6.804-17.044-16.741-20.851-29.878l23.377-9.634c2.122 8.084 5.827 14.349 11.116 18.796 5.255 4.446 11.655 6.636 19.133 6.636 7.646 0 14.215-2.324 19.705-6.973 5.491-4.648 8.253-10.577 8.253-17.752 0-7.343-2.897-13.339-8.691-17.987s-13.069-6.973-21.76-6.973h-13.507v-23.141h12.126c7.478 0 13.777-2.021 18.897-6.063s7.68-9.566 7.68-16.606c0-6.265-2.291-11.251-6.872-14.989-4.581-3.739-10.375-5.625-17.415-5.625-6.872 0-12.328 1.819-16.371 5.491-4.042 3.672-6.973 8.185-8.825 13.507l-23.141-9.634c3.065-8.691 8.691-16.371 16.943-23.006 8.253-6.636 18.796-9.971 31.596-9.971 9.465 0 17.987 1.819 25.533 5.491 7.545 3.672 13.474 8.758 17.752 15.225 4.278 6.501 6.4 13.777 6.4 21.861 0 8.253-1.987 15.225-5.962 20.952-3.975 5.726-8.859 10.105-14.653 13.171v1.381c7.646 3.2 13.878 8.084 18.796 14.653 4.884 6.568 7.343 14.417 7.343 23.579s-2.324 17.347-6.973 24.522c-4.648 7.175-11.082 12.834-19.234 16.943-8.185 4.109-17.381 6.198-27.587 6.198-11.823.033-22.736-3.369-32.808-10.174zm143.596-116.008-25.668 18.56-12.833-19.47 46.046-33.212h17.651v156.665h-25.196z"
                                    data-original="#0085f7" />
                                <path fill="#00a94b"
                                    d="M390.737 390.737H121.263l-38.574 56.837L121.263 512h269.474l31.868-68.546z"
                                    data-original="#00a94b" />
                                <path fill="#0085f7"
                                    d="M390.737 0H40.421C18.088 0 0 18.088 0 40.421v350.316l60.632 43.103 60.632-43.103V121.263h269.474l41.482-60.632z"
                                    data-original="#0085f7" />
                                <path fill="#00802e"
                                    d="M0 390.737v80.842C0 493.912 18.088 512 40.421 512h80.842V390.737z"
                                    data-original="#00802e" />
                                <path fill="#ffbc00"
                                    d="m512 121.263-60.632-39.014-60.631 39.014v269.474l54.529 28.463L512 390.737z"
                                    data-original="#ffbc00" />
                                <path fill="#0067d5"
                                    d="M512 121.263V40.421C512 18.088 493.912 0 471.579 0h-80.842v121.263z"
                                    data-original="#0067d5" />
                                <path fill="#ff4131" d="M390.737 512 512 390.737H390.737z" data-original="#ff4131" />
                            </svg>
                            <h6 className="font-semibold text-base">Google Calendar</h6>
                        </div>
                        <div
                            className="p-4 bg-white rounded-lg shadow-sm flex items-center justify-center gap-4 h-24 hover:shadow-md transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0" viewBox="0 0 512 512">
                                <path fill="#4caf50" d="M272 240h240V16c0-8.832-7.168-16-16-16H272v240z"
                                    data-original="#4caf50" />
                                <path fill="#f44336" d="M240 240V0H16C7.168 0 0 7.168 0 16v224h240z"
                                    data-original="#f44336" />
                                <path fill="#2196f3" d="M240 272H0v224c0 8.832 7.168 16 16 16h224V272z"
                                    data-original="#2196f3" />
                                <path fill="#ffc107" d="M272 272v240h224c8.832 0 16-7.168 16-16V272H272z"
                                    data-original="#ffc107" />
                            </svg>
                            <h6 className="font-semibold text-base">Microsoft Teams</h6>
                        </div>
                        <div
                            className="p-4 bg-white rounded-lg shadow-sm flex items-center justify-center gap-4 h-24 hover:shadow-md transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0" viewBox="0 0 512 512">
                                <rect width="512" height="512" fill="#2D8CFF" rx="15%" />
                                <path fill="#fff"
                                    d="M428 357c8 2 15-2 19-8 2-3 2-8 2-19V179c0-11 0-15-2-19-3-8-11-11-19-8-21 14-67 55-68 72-.8 3-.8 8-.8 15v38c0 8 0 11 .8 15 1 8 4 15 8 19 12 9 52 45 61 45zM64 187c0-15 0-23 3-27 2-4 8-8 11-11 4-3 11-3 27-3h129c38 0 57 0 72 8 11 8 23 15 30 30 8 15 8 34 8 72v68c0 15 0 23-3 27-2 4-8 8-11 11-4 3-11 3-27 3H174c-38 0-57 0-72-8-11-8-23-15-30-30-8-15-8-34-8-72z" />
                            </svg>
                            <h6 className="font-semibold text-base">Zoom</h6>
                        </div>
                        <div
                            className="p-4 bg-white rounded-lg shadow-sm flex items-center justify-center gap-4 h-24 hover:shadow-md transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0" viewBox="0 0 512 512">
                                <path fill="#54e360"
                                    d="M320.818 0c-29.259 0-53.063 23.803-53.063 53.061v130.263c0 29.259 23.804 53.063 53.063 53.063 29.258 0 53.061-23.804 53.061-53.063V53.061C373.879 23.803 350.076 0 320.818 0z"
                                    data-original="#54e360" />
                                <path fill="#00b44b"
                                    d="M458.939 130.263c-29.259 0-53.063 23.803-53.063 53.061v38.063c0 8.284 6.716 15 15 15h38.063c29.258 0 53.061-23.804 53.061-53.063s-23.803-53.061-53.061-53.061z"
                                    data-original="#00b44b" />
                                <path fill="#008adf"
                                    d="M183.322 138.123H53.061C23.803 138.123 0 161.926 0 191.183c0 29.259 23.803 53.063 53.061 53.063h130.262c29.258 0 53.061-23.804 53.061-53.063-.001-29.257-23.804-53.06-53.062-53.06z"
                                    data-original="#008adf" />
                                <path fill="#0065a3"
                                    d="M183.322 0c-29.258 0-53.061 23.803-53.061 53.061s23.803 53.062 53.061 53.062h38.061c8.284 0 15-6.716 15-15V53.061C236.383 23.803 212.58 0 183.322 0z"
                                    data-original="#0065a3" />
                                <path fill="#ff0059"
                                    d="M191.182 275.614c-29.258 0-53.061 23.804-53.061 53.063v130.261c0 29.259 23.803 53.063 53.061 53.063 29.26 0 53.064-23.804 53.064-53.063V328.677c0-29.259-23.805-53.063-53.064-53.063z"
                                    data-original="#ff0059" />
                                <path fill="#d20041"
                                    d="M91.123 275.614H53.061C23.803 275.614 0 299.418 0 328.677c0 29.258 23.803 53.061 53.061 53.061 29.259 0 53.063-23.803 53.063-53.061v-38.063c-.001-8.284-6.717-15-15.001-15z"
                                    data-original="#d20041" />
                                <path fill="#ffd400"
                                    d="M458.939 267.753H328.678c-29.258 0-53.061 23.804-53.061 53.063 0 29.257 23.803 53.06 53.061 53.06H458.94c29.258 0 53.061-23.803 53.061-53.06-.001-29.259-23.804-53.063-53.062-53.063z"
                                    data-original="#ffd400" />
                                <path fill="#ff9f04"
                                    d="M328.678 405.876h-38.061c-8.284 0-15 6.716-15 15v38.062c0 29.259 23.803 53.063 53.061 53.063 29.259 0 53.063-23.804 53.063-53.063-.001-29.258-23.804-53.062-53.063-53.062z"
                                    data-original="#ff9f04" />
                            </svg>
                            <h6 className="font-semibold text-base">Slack</h6>
                        </div>
                        <div
                            className="p-4 bg-white rounded-lg shadow-sm flex items-center justify-center gap-4 h-24 hover:shadow-md transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0" viewBox="0 0 256 256">
                                <path fill="#FF4A00"
                                    d="M128.08 0c7.231.013 14.343.624 21.256 1.78V76.3l52.831-52.696a128.425 128.425 0 0 1 16.34 13.789 128.468 128.468 0 0 1 13.84 16.312L179.513 106.4h74.715A127.58 127.58 0 0 1 256 127.587v.173c0 7.226-.613 14.306-1.772 21.2H179.5l52.847 52.682a129.615 129.615 0 0 1-13.824 16.312h-.015a128.254 128.254 0 0 1-16.326 13.789l-52.846-52.696v74.52a130.321 130.321 0 0 1-21.243 1.781h-.186a130.26 130.26 0 0 1-21.23-1.78v-74.52l-52.831 52.695a128.401 128.401 0 0 1-30.18-30.1L76.5 148.96H1.785A126.984 126.984 0 0 1 0 127.72v-.371c.012-1.875.135-4.166.311-6.536l.055-.713c.522-6.671 1.419-13.7 1.419-13.7H76.5L23.666 53.705a126.265 126.265 0 0 1 13.81-16.286l.026-.026a127.746 127.746 0 0 1 16.344-13.789L106.677 76.3V1.78A130.278 130.278 0 0 1 127.933 0h.147Zm-.013 95.76h-.122c-9.509 0-18.616 1.74-27.034 4.902a76.662 76.662 0 0 0-4.915 26.952v.12a76.383 76.383 0 0 0 4.927 26.951 76.608 76.608 0 0 0 27.022 4.902h.122c9.51 0 18.617-1.74 27.022-4.902a76.146 76.146 0 0 0 4.915-26.952v-.12c0-9.484-1.747-18.57-4.915-26.951a76.614 76.614 0 0 0-27.022-4.902Z" />
                            </svg>
                            <h6 className="font-semibold text-base">Zapier</h6>
                        </div>
                        <div
                            className="p-4 bg-white rounded-lg shadow-sm flex items-center justify-center gap-4 h-24 hover:shadow-md transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0" viewBox="0 0 512 512">
                                <g fill="#00a1e2">
                                    <path
                                        d="M144.33 246.588a60.33 60.33 0 0 0-8.052-.688c-6.058-.075-8.635 2.149-8.617 2.146-1.787 1.261-2.653 3.142-2.653 5.738 0 1.655.301 2.948.89 3.856.386.604.548.832 1.712 1.761l.017.01c-.019-.006 2.653 2.096 8.692 1.732 4.252-.256 8.015-1.066 8.015-1.066h-.004v-13.489zm177.564-17.646c-3.913 0-6.683 1.335-8.504 4.12-1.833 2.803-2.766 6.792-2.766 11.871 0 5.08.928 9.106 2.766 11.928 1.825 2.796 4.609 4.158 8.504 4.158s6.69-1.373 8.541-4.177c1.854-2.839 2.802-6.843 2.803-11.918-.001-5.075-.938-9.062-2.803-11.862-1.844-2.771-4.628-4.12-8.541-4.12zm-119.235-.225c-3.894 0-6.664 1.523-8.485 4.308-1.213 1.824-1.988 4.175-2.407 6.995l21.165.004c-.201-2.729-.736-5.164-1.957-6.999-1.844-2.777-4.422-4.308-8.316-4.308z"
                                        data-original="#00a1e2" />
                                    <path
                                        d="M401.563 125.308a109.12 109.12 0 0 0-44.589 9.501c-15.804-28.032-45.153-46.846-79.018-46.846-25.399 0-48.389 10.648-64.908 27.844l.019.098a99.087 99.087 0 0 0-79.018-39.133c-54.936 0-99.525 44.401-99.525 99.338a98.968 98.968 0 0 0 8.184 39.509C17.196 230.669 0 258.514 0 290.497c0 47.6 38.192 86.355 85.415 86.355a84.844 84.844 0 0 0 17.572-1.828c12.981 35.182 46.658 60.204 86.355 60.204 38.004 0 70.646-23.142 84.662-56.065a80.348 80.348 0 0 0 35.37 8.128c30.102 0 56.536-16.744 70.364-41.391a111.489 111.489 0 0 0 21.824 2.163C462.52 348.063 512 298.207 512 236.686s-49.48-111.378-110.437-111.378zm-291.51 129.171c0 8.992-6.528 14.58-17.026 14.58-5.155 0-10.084-.809-15.314-3.574-.978-.566-1.955-1.07-2.916-1.767-.104-.148-.54-.324-.218-1.163l-.008-.015 2.07-5.757c.327-.986 1.08-.657 1.381-.475.57.348.992.658 1.731 1.09 6.115 3.864 11.757 3.895 13.527 3.895 4.553 0 7.394-2.428 7.394-5.683v-.177c0-3.537-4.365-4.884-9.407-6.434l-1.114-.347c-6.923-1.976-14.336-4.835-14.336-13.603v-.179c0-8.315 6.717-14.129 16.33-14.129l1.048-.004c5.644 0 11.1 1.637 15.051 4.045.359.215.709.63.51 1.182-.188.526-1.943 5.225-2.145 5.757-.371.984-1.39.325-1.39.325-3.443-1.901-8.824-3.405-13.339-3.405-4.064 0-6.698 2.164-6.698 5.099v.175c0 3.425 4.496 4.896 9.708 6.585l.901.292c6.886 2.164 14.261 5.192 14.261 13.508v.179zm43.067 11.57s-1.099.299-2.088.526a178.608 178.608 0 0 1-7.469 1.452 54.322 54.322 0 0 1-9.012.751c-2.897 0-5.531-.269-7.864-.802-2.352-.526-4.389-1.414-6.039-2.614a12.304 12.304 0 0 1-3.876-4.647c-.903-1.862-1.36-4.139-1.36-6.773 0-2.596.536-4.891 1.588-6.848a14.364 14.364 0 0 1 4.308-4.892c1.787-1.287 3.876-2.254 6.19-2.879 2.295-.62 4.76-.937 7.3-.937 1.863 0 3.424.043 4.628.132l.028.069s2.352.213 4.892.581v-1.255c0-3.95-.826-5.83-2.446-7.074-1.656-1.27-4.139-1.919-7.337-1.919 0 0-7.224-.094-12.925 3.011-.263.156-.487.244-.487.244s-.713.251-.975-.481l-2.107-5.644c-.32-.818.267-1.18.267-1.18 2.671-2.093 9.143-3.35 9.143-3.35 2.145-.431 5.738-.731 7.958-.731 5.926 0 10.498 1.373 13.621 4.102 3.134 2.728 4.722 7.149 4.722 13.095l.017 27.092c.001 0 .057.784-.677.971zm19.905.955c0 .497-.354.901-.85.901h-7.87c-.499 0-.852-.404-.852-.901v-63.342c0-.495.354-.896.852-.896h7.87c.497 0 .85.4.85.896v63.342zm49.187-20.409c-.081.765-.864.771-.864.771l-29.726-.022c.169 4.516 1.26 7.695 3.443 9.877 2.145 2.132 5.569 3.492 10.16 3.5 7.055.019 10.065-1.407 12.191-2.201 0 0 .82-.294 1.12.518l1.938 5.437c.389.917.077 1.234-.25 1.419-1.844 1.034-6.359 2.944-14.938 2.973-4.177.013-7.789-.587-10.78-1.744-3.01-1.167-5.512-2.822-7.469-4.948-1.938-2.107-3.39-4.646-4.29-7.544-.897-2.879-1.347-6.059-1.347-9.482 0-3.349.435-6.547 1.298-9.464.865-2.953 2.226-5.531 4.026-7.713 1.806-2.183 4.102-3.929 6.83-5.212 2.728-1.273 6.096-1.9 9.802-1.9a21.628 21.628 0 0 1 8.504 1.726c1.863.79 3.725 2.239 5.644 4.289 1.204 1.299 3.055 4.14 3.8 6.942l.021.006c1.905 6.676.919 12.456.887 12.772zm24.52 22.449c-5.155 0-10.084-.81-15.315-3.575-.978-.566-1.958-1.07-2.916-1.767-.107-.148-.544-.323-.222-1.162l-.023-.016 2.07-5.757c.303-.94 1.189-.595 1.379-.474.561.361.993.658 1.733 1.089 6.096 3.864 11.753 3.895 13.527 3.895 4.553 0 7.394-2.427 7.394-5.682v-.177c0-3.537-4.346-4.884-9.407-6.435l-1.112-.346c-6.923-1.976-14.336-4.836-14.336-13.603v-.179c0-8.316 6.716-14.13 16.33-14.13l1.05-.003c5.644 0 11.1 1.637 15.051 4.045.357.214.709.63.508 1.182-.169.526-1.927 5.225-2.126 5.757-.373.983-1.392.325-1.392.325-3.462-1.902-8.824-3.405-13.339-3.405-4.064 0-6.698 2.163-6.698 5.099v.175c0 3.424 4.496 4.896 9.708 6.585l.901.292c6.905 2.163 14.261 5.192 14.261 13.508v.177c.001 8.994-6.528 14.582-17.026 14.582zm51.947-40.126c-.171.894-.995.863-.995.863h-9.776l-6.686 37.833c-.702 3.911-1.578 7.268-2.608 9.971-1.041 2.729-2.128 4.729-3.857 6.638-1.599 1.771-3.407 3.078-5.484 3.829-2.064.745-4.553 1.129-7.285 1.129-1.304 0-2.696-.024-4.348-.414a22.169 22.169 0 0 1-2.711-.792c-.372-.134-.668-.597-.457-1.184.207-.595 1.955-5.401 2.201-6.032.303-.771 1.072-.478 1.072-.478.529.222.896.38 1.601.52.706.141 1.661.262 2.38.262 1.291 0 2.468-.158 3.492-.503 1.24-.416 1.958-1.129 2.717-2.098.783-1.001 1.419-2.38 2.07-4.22.66-1.864 1.257-4.325 1.778-7.316l6.655-37.145h-6.559c-.79.004-1.044-.365-.967-.956l1.106-6.171c.173-.897.995-.863.995-.863h6.737l.363-2.012c1.007-5.958 3.014-10.486 5.964-13.459 2.971-2.995 7.202-4.512 12.57-4.512 1.351-.015 2.701.09 4.034.312.991.173 1.97.405 2.933.696.211.083.779.364.546 1.034l-2.269 6.231c-.19.469-.32.755-1.287.459a17.983 17.983 0 0 0-1.518-.37 12.338 12.338 0 0 0-2.438-.247 10.322 10.322 0 0 0-3.185.459 6.16 6.16 0 0 0-2.485 1.547c-.741.743-1.616 1.825-2.081 3.166-1.089 3.143-1.52 6.479-1.567 6.694h9.488c.794-.004 1.046.365.969.956l-1.108 6.173zm43.308 25.441c-.865 2.916-2.203 5.475-3.989 7.62-1.787 2.145-4.064 3.86-6.735 5.079-2.672 1.22-5.832 1.84-9.388 1.84s-6.717-.62-9.407-1.84c-2.672-1.223-4.946-2.935-6.735-5.079-1.787-2.146-3.129-4.704-3.989-7.62-.856-2.897-1.291-6.058-1.291-9.426 0-3.367.435-6.528 1.291-9.426.865-2.916 2.205-5.475 3.989-7.619 1.787-2.145 4.064-3.868 6.735-5.117 2.69-1.248 5.832-1.882 9.407-1.882s6.735.63 9.407 1.882c2.69 1.241 4.946 2.973 6.735 5.117 1.787 2.145 3.125 4.703 3.989 7.619h-.019c.854 2.897 1.289 6.077 1.289 9.426 0 3.369-.435 6.529-1.289 9.426zm36.375-31.136.019-.122c-.282.809-1.729 4.871-2.239 6.228-.194.516-.512.865-1.084.801 0 0-1.703-.398-3.255-.398-1.349 0-2.692.188-3.989.561a9.026 9.026 0 0 0-3.669 2.201c-1.078 1.054-1.953 2.523-2.596 4.365-.653 1.862-.98 4.816-.98 7.789v22.2a.9.9 0 0 1-.899.9h-7.789a.902.902 0 0 1-.901-.9v-44.213c0-.497.357-.897.85-.897h7.601c.5 0 .852.4.852.897l.004 3.612c1.129-1.543 3.164-2.877 5.004-3.706 1.863-.836 3.932-1.464 7.657-1.23 1.938.12 4.461.652 4.967.845l.025.01a.803.803 0 0 1 .422 1.057zm37.495 43.354c-3.311 1.312-7.921 2.22-12.417 2.22-7.601 0-13.433-2.182-17.309-6.509-3.876-4.309-5.832-10.197-5.832-17.46 0-3.367.48-6.547 1.43-9.444.959-2.916 2.389-5.475 4.271-7.619 1.881-2.146 4.252-3.87 7.055-5.118 2.803-1.249 6.077-1.879 9.764-1.879 2.483 0 4.685.15 6.585.44 2.032.307 4.715 1.034 5.851 1.479.209.081.781.363.548 1.031-.826 2.333-1.394 3.856-2.164 5.982-.329.905-1.016.605-1.016.605-2.897-.906-5.663-1.326-9.275-1.326-4.327 0-7.601 1.468-9.727 4.29-2.154 2.859-3.354 6.585-3.368 11.552-.019 5.456 1.336 9.481 3.763 11.984 2.408 2.5 5.795 3.763 10.028 3.763 1.712 0 3.337-.115 4.797-.345 1.449-.226 2.809-.677 4.083-1.164 0 0 .832-.322 1.119.53h.007l2.164 5.945a.798.798 0 0 1-.357 1.043zm43.991-19.982c-.081.765-.864.771-.864.771l-29.726-.022c.169 4.516 1.26 7.695 3.443 9.877 2.145 2.132 5.55 3.492 10.159 3.5 7.055.019 10.065-1.407 12.191-2.201 0 0 .82-.294 1.118.518l1.938 5.437c.388.917.077 1.234-.252 1.419-1.844 1.034-6.359 2.944-14.938 2.973-4.158.013-7.789-.587-10.78-1.744-3.01-1.167-5.513-2.822-7.469-4.948-1.957-2.107-3.407-4.646-4.308-7.544-.892-2.879-1.345-6.059-1.345-9.482 0-3.349.437-6.547 1.302-9.464.865-2.953 2.222-5.531 4.026-7.713 1.806-2.183 4.101-3.929 6.829-5.212 2.728-1.273 6.096-1.9 9.802-1.9a21.628 21.628 0 0 1 8.504 1.726c1.863.79 3.725 2.239 5.644 4.289 1.204 1.299 3.053 4.14 3.8 6.942l.04.006c1.904 6.676.918 12.456.886 12.772z"
                                        data-original="#00a1e2" />
                                    <path
                                        d="M440.278 228.717c-3.894 0-6.666 1.523-8.485 4.308-1.215 1.824-1.988 4.175-2.407 6.995l21.165.004c-.199-2.729-.734-5.164-1.957-6.999-1.844-2.777-4.422-4.308-8.316-4.308z"
                                        data-original="#00a1e2" />
                                </g>
                            </svg>
                            <h6 className="font-semibold text-base">Salesforce</h6>
                        </div>
                        <div
                            className="p-4 bg-white rounded-lg shadow-sm flex items-center justify-center gap-4 h-24 hover:shadow-md transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 fill-[#ff5c35]"
                                viewBox="0 0 512.599 512.599">
                                <path
                                    d="M457.21 512.599H55.389C24.799 512.599 0 487.8 0 457.21V55.389C0 24.799 24.799 0 55.389 0h401.82c30.591 0 55.389 24.799 55.389 55.389v401.82c.001 30.591-24.798 55.39-55.388 55.39z"
                                    data-original="#000000" />
                                <path
                                    d="M457.21 512.599H55.389C24.799 512.599 0 487.8 0 457.21V55.389C0 24.799 24.799 0 55.389 0h401.82c30.591 0 55.389 24.799 55.389 55.389v401.82c.001 30.591-24.798 55.39-55.388 55.39z"
                                    data-original="#000000" />
                                <path fill="#fff"
                                    d="M346.156 196.982v-41.494a31.988 31.988 0 0 0 18.451-28.841v-.97c-.047-17.635-14.331-31.919-31.966-31.966h-.97c-17.635.047-31.919 14.332-31.966 31.966v.97a31.99 31.99 0 0 0 18.451 28.841v41.58a90.666 90.666 0 0 0-43.111 18.969l-114.113-88.872c5.189-19.426-6.353-39.38-25.779-44.569s-39.38 6.353-44.568 25.779c-5.189 19.426 6.353 39.38 25.779 44.568a36.404 36.404 0 0 0 27.518-3.599l112.195 87.342c-20.682 31.202-20.126 71.891 1.401 102.517l-34.143 34.143a29.323 29.323 0 0 0-8.471-1.38c-16.369 0-29.638 13.27-29.638 29.638 0 16.369 13.27 29.638 29.638 29.638 16.369 0 29.638-13.27 29.638-29.638a29.182 29.182 0 0 0-1.38-8.471l33.777-33.777c39.971 30.531 97.124 22.878 127.654-17.093s22.878-97.124-17.093-127.654a91.06 91.06 0 0 0-41.369-17.628m-13.989 136.705c-25.809-.06-46.683-21.03-46.624-46.839.06-25.809 21.03-46.683 46.839-46.624 25.775.059 46.636 20.978 46.624 46.753 0 25.809-20.922 46.732-46.732 46.732"
                                    data-original="#ffffff" />
                            </svg>
                            <h6 className="font-semibold text-base">HubSpot</h6>
                        </div>
                        <div
                            className="p-4 bg-white rounded-lg shadow-sm flex items-center justify-center gap-4 h-24 hover:shadow-md transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0"
                                viewBox="0 0 28.87 28.87">
                                <rect width="28.87" height="28.87" fill="#6772e5" rx="6.48" ry="6.48" />
                                <path fill="#fff" fillRule="evenodd"
                                    d="M13.3 11.2c0-.69.57-1 1.49-1a9.84 9.84 0 0 1 4.37 1.13V7.24a11.6 11.6 0 0 0-4.36-.8c-3.56 0-5.94 1.86-5.94 5 0 4.86 6.68 4.07 6.68 6.17 0 .81-.71 1.07-1.68 1.07A11.06 11.06 0 0 1 9 17.25v4.19a12.19 12.19 0 0 0 4.8 1c3.65 0 6.17-1.8 6.17-5 .03-5.21-6.67-4.27-6.67-6.24z" />
                            </svg>
                            <h6 className="font-semibold text-base">Stripe</h6>
                        </div>
                        <div
                            className="p-4 bg-white rounded-lg shadow-sm flex items-center justify-center gap-4 h-24 hover:shadow-md transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0" viewBox="0 0 512 512">
                                <path fill="#cfd8dc"
                                    d="m443.499 417.941-181.333-128a10.667 10.667 0 0 0-12.309 0l-181.333 128a10.667 10.667 0 0 0-4.523 8.725v10.667C64 443.224 68.776 448 74.667 448h362.667c5.891 0 10.667-4.776 10.667-10.667v-10.667a10.671 10.671 0 0 0-4.502-8.725z"
                                    data-original="#cfd8dc" />
                                <path fill="#fafafa"
                                    d="m262.165 289.941-181.333-128c-4.807-3.405-11.465-2.268-14.87 2.539A10.658 10.658 0 0 0 64 170.666v256c-.012 5.891 4.755 10.676 10.646 10.688a10.673 10.673 0 0 0 6.186-1.962l181.333-128c4.813-3.397 5.961-10.052 2.564-14.865a10.655 10.655 0 0 0-2.564-2.564v-.022z"
                                    data-original="#fafafa" />
                                <path fill="#eee"
                                    d="M442.24 161.195a10.796 10.796 0 0 0-11.072.747l-181.333 128c-4.813 3.397-5.961 10.052-2.564 14.865a10.655 10.655 0 0 0 2.564 2.564l181.333 128c4.807 3.405 11.465 2.268 14.87-2.539a10.661 10.661 0 0 0 1.962-6.165v-256c0-3.986-2.221-7.639-5.76-9.472z"
                                    data-original="#eeeeee" />
                                <path fill="#eceff1"
                                    d="M468.8 71.339A10.666 10.666 0 0 0 458.667 64H53.333c-5.891 0-10.667 4.776-10.667 10.667 0 3.357 1.581 6.519 4.267 8.533L249.6 232.533a10.669 10.669 0 0 0 12.651 0L464.917 83.2a10.666 10.666 0 0 0 3.883-11.861z"
                                    data-original="#eceff1" />
                                <path fill="#f44336"
                                    d="M458.667 64a10.67 10.67 0 0 0-6.4 2.133L256 210.752 59.733 66.133a10.67 10.67 0 0 0-6.4-2.133C23.878 64 0 87.878 0 117.333v277.333C0 424.122 23.878 448 53.333 448h21.333c5.891 0 10.667-4.776 10.667-10.667v-246.08l164.501 116.139a10.667 10.667 0 0 0 12.309 0l164.523-116.139v246.08c0 5.891 4.776 10.667 10.667 10.667h21.333C488.122 448 512 424.122 512 394.667V117.333C512 87.878 488.122 64 458.667 64z"
                                    data-original="#f44336" />
                            </svg>
                            <h6 className="font-semibold text-base">Gmail</h6>
                        </div>
                        <div
                            className="p-4 bg-white rounded-lg shadow-sm flex items-center justify-center gap-4 h-24 hover:shadow-md transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0" viewBox="0 0 48 48">
                                <path fill="#03A9F4"
                                    d="M21 31a2 2 0 0 0 2 2h17a2 2 0 0 0 2-2V16a2 2 0 0 0-2-2H23a2 2 0 0 0-2 2v15z" />
                                <path fill="#B3E5FC"
                                    d="M42 16.975V16a1.98 1.98 0 0 0-.367-1.148l-11.264 6.932-7.542-4.656L22.125 19l8.459 5L42 16.975z" />
                                <path fill="#0277BD" d="m27 41.46-21-4v-28l21-4z" />
                                <path fill="#FFF"
                                    d="M21.216 18.311c-1.098-1.275-2.546-1.913-4.328-1.913-1.892 0-3.408.669-4.554 2.003-1.144 1.337-1.719 3.088-1.719 5.246 0 2.045.564 3.714 1.69 4.986 1.126 1.273 2.592 1.91 4.378 1.91 1.84 0 3.331-.652 4.474-1.975 1.143-1.313 1.712-3.043 1.712-5.199 0-2.088-.551-3.774-1.653-5.058zm-2.167 8.424c-.568.769-1.339 1.152-2.313 1.152-.939 0-1.699-.394-2.285-1.187-.581-.785-.87-1.861-.87-3.211 0-1.336.289-2.414.87-3.225.586-.81 1.368-1.211 2.355-1.211.962 0 1.718.393 2.267 1.178.555.795.833 1.895.833 3.31.001 1.365-.288 2.427-.857 3.194z" />
                            </svg>
                            <h6 className="font-semibold text-base">Microsoft Outlook</h6>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- pricing section --> */}
            <div id="pricing" className="px-4 sm:px-10 md:mt-28 mt-16">
                <div className="max-w-5xl max-lg:max-w-2xl mx-auto">
                    <div className="container mx-auto">
                        <div className="text-center max-w-4xl mx-auto">
                            <p className="text-blue-600 font-semibold mb-2">FLEXIBLE PLANS</p>
                            <h2 className="text-2xl md:text-3xl font-bold leading-relaxed">Choose the Perfect Plan</h2>
                            <div className="max-w-2xl mx-auto mt-6">
                                <p className="leading-relaxed">Select a plan that fits your needs, whether
                                    you're an
                                    individual or part of a large team.</p>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-6 max-sm:max-w-sm max-sm:mx-auto mt-16">

                            <div
                                className="relative bg-white shadow-sm rounded-3xl p-6 border border-gray-200 hover:border-blue-600 transition-all">
                                <h4 className="text-lg font-medium mb-4">Basic</h4>
                                <h3 className="text-4xl font-semibold">$4.50<sub
                                        className="text-slate-500 font-medium text-sm ml-1">/
                                        month</sub></h3>

                                <hr className="my-6 border-gray-300" />

                                <div>
                                    <ul className="space-y-4">
                                        <li className="flex items-center font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18"
                                                className="mr-3 bg-blue-100 fill-blue-600 rounded-full p-[3px] w-[18px] h-[18px]"
                                                viewBox="0 0 24 24">
                                                <path
                                                    d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                                                    data-original="#000000" />
                                            </svg>
                                            Up to 5 meetings per month
                                        </li>
                                        <li className="flex items-center font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18"
                                                className="mr-3 bg-blue-100 fill-blue-600 rounded-full p-[3px] w-[18px] h-[18px]"
                                                viewBox="0 0 24 24">
                                                <path
                                                    d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                                                    data-original="#000000" />
                                            </svg>
                                            Basic calendar integration
                                        </li>
                                        <li className="flex items-center font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18"
                                                className="mr-3 bg-blue-100 fill-blue-600 rounded-full p-[3px] w-[18px] h-[18px]"
                                                viewBox="0 0 24 24">
                                                <path
                                                    d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                                                    data-original="#000000" />
                                            </svg>
                                            Email notifications
                                        </li>
                                        <li className="flex items-center font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18"
                                                className="mr-3 bg-blue-100 fill-blue-600 rounded-full p-[3px] w-[18px] h-[18px]"
                                                viewBox="0 0 24 24">
                                                <path
                                                    d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                                                    data-original="#000000" />
                                            </svg>
                                            Single meeting type
                                        </li>
                                    </ul>

                                    <div className="min-h-[40px] mt-6">
                                        <button type="button"
                                            className="cursor-pointer absolute bottom-6 left-0 right-0 mx-auto w-11/12 px-4 py-2 font-medium tracking-wide bg-blue-600 hover:bg-blue-700 text-white rounded-xl">Get
                                            Started</button>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="relative bg-white shadow-sm rounded-3xl p-6 border border-gray-200 hover:border-blue-600 transition-all">
                                <h4 className="text-lg font-medium mb-4">Professional</h4>
                                <h3 className="text-4xl font-semibold">$14.50<sub
                                        className="text-slate-500 font-medium text-sm ml-1">/
                                        month</sub></h3>

                                <hr className="my-6 border-gray-300" />

                                <div>
                                    <ul className="space-y-4">
                                        <li className="flex items-center font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18"
                                                className="mr-3 bg-blue-100 fill-blue-600 rounded-full p-[3px] w-[18px] h-[18px]"
                                                viewBox="0 0 24 24">
                                                <path
                                                    d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                                                    data-original="#000000" />
                                            </svg>
                                            Unlimited meetings
                                        </li>
                                        <li className="flex items-center font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18"
                                                className="mr-3 bg-blue-100 fill-blue-600 rounded-full p-[3px] w-[18px] h-[18px]"
                                                viewBox="0 0 24 24">
                                                <path
                                                    d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                                                    data-original="#000000" />
                                            </svg>
                                            Multiple calendars
                                        </li>
                                        <li className="flex items-center font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18"
                                                className="mr-3 bg-blue-100 fill-blue-600 rounded-full p-[3px] w-[18px] h-[18px]"
                                                viewBox="0 0 24 24">
                                                <path
                                                    d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                                                    data-original="#000000" />
                                            </svg>
                                            SMS reminders
                                        </li>
                                        <li className="flex items-center font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18"
                                                className="mr-3 bg-blue-100 fill-blue-600 rounded-full p-[3px] w-[18px] h-[18px]"
                                                viewBox="0 0 24 24">
                                                <path
                                                    d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                                                    data-original="#000000" />
                                            </svg>
                                            Group scheduling
                                        </li>
                                        <li className="flex items-center font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18"
                                                className="mr-3 bg-blue-100 fill-blue-600 rounded-full p-[3px] w-[18px] h-[18px]"
                                                viewBox="0 0 24 24">
                                                <path
                                                    d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                                                    data-original="#000000" />
                                            </svg>
                                            Dedicated Server
                                        </li>
                                        <li className="flex items-center font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18"
                                                className="mr-3 bg-blue-100 fill-blue-600 rounded-full p-[3px] w-[18px] h-[18px]"
                                                viewBox="0 0 24 24">
                                                <path
                                                    d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                                                    data-original="#000000" />
                                            </svg>
                                            Custom branding
                                        </li>
                                    </ul>
                                    <div className="min-h-[40px] mt-6">
                                        <button type="button"
                                            className="cursor-pointer absolute bottom-6 left-0 right-0 mx-auto w-11/12 px-4 py-2 font-medium tracking-wide bg-blue-600 hover:bg-blue-700 text-white rounded-xl">Get
                                            Started</button>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="relative bg-white shadow-sm rounded-3xl p-6 border border-gray-200 hover:border-blue-600 transition-all">
                                <h4 className="text-lg font-medium mb-4">Enterprise</h4>
                                <h3 className="text-4xl font-semibold">$24.50<sub
                                        className="text-slate-500 font-medium text-sm ml-1">/
                                        month</sub></h3>

                                <hr className="my-6 border-gray-300" />

                                <div>
                                    <ul className="space-y-4">
                                        <li className="flex items-center font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18"
                                                className="mr-3 bg-blue-100 fill-blue-600 rounded-full p-[3px] w-[18px] h-[18px]"
                                                viewBox="0 0 24 24">
                                                <path
                                                    d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                                                    data-original="#000000" />
                                            </svg>
                                            Everything in Professional
                                        </li>
                                        <li className="flex items-center font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18"
                                                className="mr-3 bg-blue-100 fill-blue-600 rounded-full p-[3px] w-[18px] h-[18px]"
                                                viewBox="0 0 24 24">
                                                <path
                                                    d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                                                    data-original="#000000" />
                                            </svg>
                                            Team management
                                        </li>
                                        <li className="flex items-center font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18"
                                                className="mr-3 bg-blue-100 fill-blue-600 rounded-full p-[3px] w-[18px] h-[18px]"
                                                viewBox="0 0 24 24">
                                                <path
                                                    d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                                                    data-original="#000000" />
                                            </svg>
                                            Advanced integrations
                                        </li>
                                        <li className="flex items-center font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18"
                                                className="mr-3 bg-blue-100 fill-blue-600 rounded-full p-[3px] w-[18px] h-[18px]"
                                                viewBox="0 0 24 24">
                                                <path
                                                    d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                                                    data-original="#000000" />
                                            </svg>
                                            Analytics dashboard
                                        </li>
                                        <li className="flex items-center font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18"
                                                className="mr-3 bg-blue-100 fill-blue-600 rounded-full p-[3px] w-[18px] h-[18px]"
                                                viewBox="0 0 24 24">
                                                <path
                                                    d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                                                    data-original="#000000" />
                                            </svg>
                                            Priority support
                                        </li>
                                    </ul>
                                    <div className="min-h-[40px] mt-6">
                                        <button type="button"
                                            className="cursor-pointer absolute bottom-6 left-0 right-0 mx-auto w-11/12 px-4 py-2 font-medium tracking-wide bg-blue-600 hover:bg-blue-700 text-white rounded-xl">Get
                                            Started</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Testimonial section --> */}
            <div id="testimonials" className="md:mt-28 mt-16 px-4 sm:px-10">
                <div className="container mx-auto">
                    <div className="text-center max-w-4xl mx-auto">
                        <p className="text-blue-600 font-semibold mb-2">CUSTOMER STORIES</p>
                        <h2 className="text-2xl md:text-3xl font-bold leading-relaxed">What Our Users Say</h2>
                        <div className="mt-6 max-w-2xl mx-auto">
                            <p className="leading-relaxed">Don't just take our word for it - hear from
                                professionals
                                who've transformed their scheduling workflow.</p>
                        </div>
                    </div>

                    <div
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 max-md:justify-center text-center max-lg:max-w-3xl max-md:max-w-lg mx-auto mt-16">
                        <div>
                            <div className="flex flex-col items-center">
                                <img src="https://readymadeui.com/team-2.webp"
                                    className="w-24 h-24 rounded-full border-2 border-blue-600" />
                                <div className="mt-6">
                                    <h4 className="font-semibold">John Doe</h4>
                                </div>
                            </div>

                            <div className="flex justify-center space-x-1 mt-2.5">
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg className="w-4 fill-[#CED5D8]" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg className="w-4 fill-[#CED5D8]" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                            </div>

                            <div className="mt-6">
                                <p className="leading-relaxed">This service has saved me
                                    countless hours of
                                    back-and-forth emails. My clients love how easy it is to book a meeting with me.</p>
                            </div>
                        </div>

                        <div>
                            <div className="flex flex-col items-center">
                                <img src="https://readymadeui.com/team-3.webp"
                                    className="w-24 h-24 rounded-full border-2 border-blue-600" />
                                <div className="mt-6">
                                    <h4 className="font-semibold">Mark Adair</h4>
                                </div>
                            </div>

                            <div className="flex justify-center space-x-1 mt-2.5">
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                            </div>

                            <div className="mt-6">
                                <p className="leading-relaxed">Since implementing this service,
                                    my booking rate
                                    has increased by 35%. The time zone feature is a game-changer for my international
                                    clients.</p>
                            </div>
                        </div>

                        <div>
                            <div className="flex flex-col items-center">
                                <img src="https://readymadeui.com/team-4.webp"
                                    className="w-24 h-24 rounded-full border-2 border-blue-600" />
                                <div className="mt-6">
                                    <h4 className="font-semibold">Simon Konecki</h4>
                                </div>
                            </div>

                            <div className="flex justify-center space-x-1 mt-2.5">
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg className="w-4 fill-[#CED5D8]" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                            </div>

                            <div className="mt-6">
                                <p className="leading-relaxed">Our team manages over 200 client
                                    meetings per
                                    month, and this service has streamlined our entire process. The group scheduling
                                    features have been valuable for our organization.</p>
                            </div>

                        </div>

                        <div>
                            <div className="flex flex-col items-center">
                                <img src="https://readymadeui.com/team-5.webp"
                                    className="w-24 h-24 rounded-full border-2 border-blue-600" />
                                <div className="mt-6">
                                    <h4 className="font-semibold">Sarah Johnson</h4>
                                </div>
                            </div>

                            <div className="flex justify-center space-x-1 mt-2.5">
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                            </div>

                            <div className="mt-6">
                                <p className="leading-relaxed">It's calendar integration is
                                    flawless. As a consultant juggling multiple projects, I can block off focus time
                                    while still remaining available for priority clients.</p>
                            </div>
                        </div>

                        <div>
                            <div className="flex flex-col items-center">
                                <img src="https://readymadeui.com/team-6.webp"
                                    className="w-24 h-24 rounded-full border-2 border-blue-600" />
                                <div className="mt-6">
                                    <h4 className="font-semibold">David Chen</h4>
                                </div>
                            </div>

                            <div className="flex justify-center space-x-1 mt-2.5">
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg className="w-4 fill-[#CED5D8]" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                            </div>

                            <div className="mt-6">
                                <p className="leading-relaxed">It's buffer time feature has been
                                    a lifesaver for my back-to-back meetings. I've reclaimed at least 5 hours weekly
                                    that I used to spend on scheduling.</p>
                            </div>
                        </div>

                        <div>
                            <div className="flex flex-col items-center">
                                <img src="https://readymadeui.com/team-1.webp"
                                    className="w-24 h-24 rounded-full border-2 border-blue-600" />
                                <div className="mt-6">
                                    <h4 className="font-semibold">Elena Rodriguez</h4>
                                </div>
                            </div>

                            <div className="flex justify-center space-x-1 mt-2.5">
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 14 13" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                            </div>

                            <div className="mt-6">
                                <p className="leading-relaxed">As a therapist, client
                                    confidentiality is essential. It's privacy features and seamless HIPAA compliance
                                    make it perfect for my practice.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- CTA Section --> */}
            <div className="py-16 bg-gradient-to-t from-blue-400 via-blue-500 to-blue-600 md:mt-28 mt-16 px-4 sm:px-10">
                <div className="container mx-auto text-center">
                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-white text-2xl md:text-3xl font-bold leading-relaxed">Ready to transform your
                            scheduling
                            experience?</h2>
                        <div className="mt-6 max-w-2xl mx-auto">
                            <p className="leading-relaxed text-white">Join thousands of professionals who've eliminated
                                scheduling headaches with It.</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
                        <button
                            className="cursor-pointer bg-white px-6 py-3 rounded-lg hover:bg-gray-100 transition font-medium">Start
                            Your Free Trial</button>
                        <button
                            className="cursor-pointer bg-transparent border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-slate-900 transition font-medium">See
                            Demo</button>
                    </div>
                </div>
            </div>

            {/* <!-- FAQ section --> */}
            <div id="faq" className="md:mt-28 mt-16 px-4 sm:px-10">
                <div className="max-w-4xl mx-auto">
                    <div className="divide-y divide-gray-300 container mx-auto">
                        <div className="text-center max-w-4xl mx-auto pb-16">
                            <p className="text-blue-600 font-semibold mb-2">COMMON QUESTIONS</p>
                            <h2 className="text-2xl md:text-3xl font-bold leading-relaxed">Frequently asked questions</h2>
                        </div>
                        <div className="accordion" role="accordion">
                            <button type="button"
                                className="toggle-button cursor-pointer w-full text-base outline-none text-left font-semibold py-4 hover:text-blue-600 flex items-center">
                                <span className="mr-4">Are there any fees for rescheduling or canceling a meeting?</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42"
                                    className="w-3 fill-current ml-auto shrink-0">
                                    <path className="plus hidden"
                                        d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
                                    <path
                                        d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
                                </svg>
                            </button>
                            <div className="content pb-4 max-h-[1000px] overflow-hidden transition-all duration-300">
                                <p className="leading-relaxed">Rescheduling is free if done at least 24 hours
                                    before the
                                    scheduled meeting time. Late cancellations or no-shows may incur a fee depending on
                                    your
                                    subscription plan. Premium members enjoy unlimited rescheduling privileges without
                                    penalties.
                                </p>
                            </div>
                        </div>

                        <div className="accordion" role="accordion">
                            <button type="button"
                                className="toggle-button cursor-pointer w-full text-base outline-none text-left font-semibold py-4 hover:text-blue-600 flex items-center">
                                <span className="mr-4">What are the available time slots for scheduling meetings?</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42"
                                    className="w-3 fill-current ml-auto shrink-0">
                                    <path className="plus"
                                        d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
                                    <path
                                        d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
                                </svg>
                            </button>
                            <div className="content invisible max-h-0 overflow-hidden transition-all duration-300">
                                <p className="leading-relaxed">Our scheduling system offers flexible time
                                    slots from 8 AM
                                    to 8 PM in your local time zone, seven days a week. Meeting durations can be set for
                                    15, 30, 45,
                                    or 60 minutes by default, with custom durations available for premium subscribers.
                                    Your
                                    availability preferences can be configured in your account settings.</p>
                            </div>
                        </div>

                        <div className="accordion" role="accordion">
                            <button type="button"
                                className="toggle-button cursor-pointer w-full text-base outline-none text-left font-semibold py-4 hover:text-blue-600 flex items-center">
                                <span className="mr-4">Can I invite multiple participants to a scheduled meeting?</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42"
                                    className="w-3 fill-current ml-auto shrink-0">
                                    <path className="plus"
                                        d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
                                    <path
                                        d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
                                </svg>
                            </button>
                            <div className="content invisible max-h-0 overflow-hidden transition-all duration-300">
                                <p className="leading-relaxed">Yes, you can invite up to 10 participants with
                                    our
                                    standard plan and up to 50 participants with our business plan. All invitees will
                                    receive
                                    calendar invitations with meeting details and reminders. Each participant can
                                    confirm their
                                    attendance or suggest alternative times if needed.</p>
                            </div>
                        </div>

                        <div className="accordion" role="accordion">
                            <button type="button"
                                className="toggle-button cursor-pointer w-full text-base outline-none text-left font-semibold py-4 hover:text-blue-600 flex items-center">
                                <span className="mr-4">How do I integrate the scheduling system with my calendar?</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42"
                                    className="w-3 fill-current ml-auto shrink-0">
                                    <path className="plus"
                                        d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
                                    <path
                                        d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
                                </svg>
                            </button>
                            <div className="content invisible max-h-0 overflow-hidden transition-all duration-300">
                                <p className="leading-relaxed">Our scheduling service integrates seamlessly
                                    with Google
                                    Calendar, Microsoft Outlook, Apple Calendar, and other major calendar providers.
                                    Simply go to
                                    your account settings, select "Calendar Integration," and follow the authorization
                                    steps. Once
                                    connected, your existing appointments will be synchronized to prevent
                                    double-bookings.</p>
                            </div>
                        </div>

                        <div className="accordion" role="accordion">
                            <button type="button"
                                className="toggle-button cursor-pointer w-full text-base outline-none text-left font-semibold py-4 hover:text-blue-600 flex items-center">
                                <span className="mr-4">Are there automatic reminders for scheduled meetings?</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42"
                                    className="w-3 fill-current ml-auto shrink-0">
                                    <path className="plus"
                                        d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
                                    <path
                                        d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
                                </svg>
                            </button>
                            <div className="content invisible max-h-0 overflow-hidden transition-all duration-300">
                                <p className="leading-relaxed">Yes, all participants receive automatic email
                                    reminders 24
                                    hours and 1 hour before the scheduled meeting. You can customize reminder timing and
                                    add SMS
                                    notifications in your notification preferences. Premium users can set up additional
                                    custom
                                    reminders and personalize notification messages.</p>
                            </div>
                        </div>

                        <div className="accordion" role="accordion">
                            <button type="button"
                                className="toggle-button cursor-pointer w-full text-base outline-none text-left font-semibold py-4 hover:text-blue-600 flex items-center">
                                <span className="mr-4">How can I set up recurring meetings?</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42"
                                    className="w-3 fill-current ml-auto shrink-0">
                                    <path className="plus"
                                        d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
                                    <path
                                        d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
                                </svg>
                            </button>
                            <div className="content invisible max-h-0 overflow-hidden transition-all duration-300">
                                <p className="leading-relaxed">To set up recurring meetings, select the
                                    "Recurring"
                                    option when creating a new meeting. You can choose daily, weekly, bi-weekly,
                                    monthly, or custom
                                    recurrence patterns. Each occurrence can be modified individually if needed, and you
                                    can set an
                                    end date or number of occurrences for the series.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        {/* <!-- footer section --> */}
        <footer className="bg-gray-100 md:mt-28 mt-16 px-4 sm:px-10 pt-16 pb-6">
            <div className="flex flex-wrap justify-between gap-10">
                <div className="max-w-md">
                    <a href='#'>
                        <img src="https://readymadeui.com/readymadeui.svg" alt="logo" className="w-36" />
                    </a>
                    <div className="mt-6">
                        <p className="leading-relaxed text-sm">Our service is a comprehensive scheduling platform that
                            streamlines the meeting process. Our intuitive interface helps professionals manage
                            appointments, coordinate with teams, and integrate with existing calendar systems to
                            maximize productivity.</p>
                    </div>
                    <ul className="mt-10 flex space-x-5">
                        <li>
                            <a href='#'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-blue-600 w-8 h-8"
                                    viewBox="0 0 49.652 49.652">
                                    <path
                                        d="M24.826 0C11.137 0 0 11.137 0 24.826c0 13.688 11.137 24.826 24.826 24.826 13.688 0 24.826-11.138 24.826-24.826C49.652 11.137 38.516 0 24.826 0zM31 25.7h-4.039v14.396h-5.985V25.7h-2.845v-5.088h2.845v-3.291c0-2.357 1.12-6.04 6.04-6.04l4.435.017v4.939h-3.219c-.524 0-1.269.262-1.269 1.386v2.99h4.56z"
                                        data-original="#000000" />
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href='#'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 112.196 112.196">
                                    <circle cx="56.098" cy="56.097" r="56.098" fill="#007ab9" data-original="#007ab9" />
                                    <path fill="#fff"
                                        d="M89.616 60.611v23.128H76.207V62.161c0-5.418-1.936-9.118-6.791-9.118-3.705 0-5.906 2.491-6.878 4.903-.353.862-.444 2.059-.444 3.268v22.524h-13.41s.18-36.546 0-40.329h13.411v5.715c-.027.045-.065.089-.089.132h.089v-.132c1.782-2.742 4.96-6.662 12.085-6.662 8.822 0 15.436 5.764 15.436 18.149zm-54.96-36.642c-4.587 0-7.588 3.011-7.588 6.967 0 3.872 2.914 6.97 7.412 6.97h.087c4.677 0 7.585-3.098 7.585-6.97-.089-3.956-2.908-6.967-7.496-6.967zm-6.791 59.77H41.27v-40.33H27.865v40.33z"
                                        data-original="#f1f2f2" />
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href='#'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 1227 1227">
                                    <path
                                        d="M613.5 0C274.685 0 0 274.685 0 613.5S274.685 1227 613.5 1227 1227 952.315 1227 613.5 952.315 0 613.5 0z"
                                        data-original="#000000" />
                                    <path fill="#fff"
                                        d="m680.617 557.98 262.632-305.288h-62.235L652.97 517.77 470.833 252.692H260.759l275.427 400.844-275.427 320.142h62.239l240.82-279.931 192.35 279.931h210.074L680.601 557.98zM345.423 299.545h95.595l440.024 629.411h-95.595z"
                                        data-original="#ffffff" />
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="max-lg:min-w-[140px]">
                    <h4 className="font-semibold relative">Scheduling</h4>

                    <ul className="mt-6 space-y-4">
                        <li>
                            <a href='#' className="hover:text-blue-700">One-on-One Meetings</a>
                        </li>
                        <li>
                            <a href='#' className="hover:text-blue-700">Group Scheduling</a>
                        </li>
                        <li>
                            <a href='#' className="hover:text-blue-700">Recurring Meetings</a>
                        </li>
                        <li>
                            <a href='#' className="hover:text-blue-700">Round Robin</a>
                        </li>
                        <li>
                            <a href='#' className="hover:text-blue-700">Collective Scheduling</a>
                        </li>
                    </ul>
                </div>

                <div className="max-lg:min-w-[140px]">
                    <h4 className="font-semibold relative">Integrations</h4>
                    <ul className="space-y-4 mt-6">
                        <li>
                            <a href='#' className="hover:text-blue-700">Google Calendar</a>
                        </li>
                        <li>
                            <a href='#' className="hover:text-blue-700">Microsoft Outlook</a>
                        </li>
                        <li>
                            <a href='#' className="hover:text-blue-700">Apple Calendar</a>
                        </li>
                        <li>
                            <a href='#' className="hover:text-blue-700">Zoom</a>
                        </li>
                    </ul>
                </div>

                <div className="max-lg:min-w-[140px]">
                    <h4 className="font-semibold relative">Company</h4>

                    <ul className="space-y-4 mt-6">
                        <li>
                            <a href='#' className="hover:text-blue-700">About us</a>
                        </li>
                        <li>
                            <a href='#' className="hover:text-blue-700">Careers</a>
                        </li>
                        <li>
                            <a href='#' className="hover:text-blue-700">Blog</a>
                        </li>
                        <li>
                            <a href='#' className="hover:text-blue-700">Testimonials</a>
                        </li>
                        <li>
                            <a href='#' className="hover:text-blue-700">Press</a>
                        </li>
                    </ul>
                </div>

                <div className="max-lg:min-w-[140px]">
                    <h4 className="font-semibold relative">Resources</h4>

                    <ul className="space-y-4 mt-6">
                        <li>
                            <a href='#' className="hover:text-blue-700">Help Center</a>
                        </li>
                        <li>
                            <a href='#' className="hover:text-blue-700">API Documentation</a>
                        </li>
                        <li>
                            <a href='#' className="hover:text-blue-700">Scheduling Tips</a>
                        </li>
                        <li>
                            <a href='#' className="hover:text-blue-700">Contact Support</a>
                        </li>
                        <li>
                            <a href='#' className="hover:text-blue-700">Community</a>
                        </li>
                    </ul>
                </div>
            </div>

            <hr className="mt-10 mb-6 border-gray-300" />

            <div className="flex flex-wrap max-md:flex-col gap-4">
                <ul className="md:flex md:space-x-6 max-md:space-y-2">
                    <li>
                        <a href='#' className="hover:text-blue-700">Terms of Service</a>
                    </li>
                    <li>
                        <a href='#' className="hover:text-blue-700">Privacy Policy</a>
                    </li>
                    <li>
                        <a href='#' className="hover:text-blue-700">Security</a>
                    </li>
                </ul>

                <p className="md:ml-auto">© Your company. All rights reserved.</p>
            </div>
        </footer>

    </div>

</div>
</div>

);}

export default HomePage;
