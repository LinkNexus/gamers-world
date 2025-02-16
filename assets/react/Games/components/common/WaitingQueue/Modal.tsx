import {useEffect, useRef} from "react";

export default function () {
    const modalRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <button type="button" data-modal-target="course-modal" data-modal-toggle="course-modal"
                    className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700">
                <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                     viewBox="0 0 24 24">
                    <path
                        d="M17.5 3A3.5 3.5 0 0 0 14 7L8.1 9.8A3.5 3.5 0 0 0 2 12a3.5 3.5 0 0 0 6.1 2.3l6 2.7-.1.5a3.5 3.5 0 1 0 1-2.3l-6-2.7a3.5 3.5 0 0 0 0-1L15 9a3.5 3.5 0 0 0 6-2.4c0-2-1.6-3.5-3.5-3.5Z"/>
                </svg>
                Share course
            </button>

            <div
                ref={modalRef}
                id="course-modal"
                tabIndex={-1}
                aria-hidden="true"
                className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="relative p-4 w-full max-w-lg max-h-full">
                    <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-800">
                        <div className="flex items-center justify-between p-4 md:p-5">
                            <h3 className="text-lg text-gray-500 dark:text-gray-400">
                                Share course
                            </h3>
                            <button type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-700 dark:hover:text-white"
                                    data-modal-toggle="course-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                     viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="px-4 pb-4 md:px-5 md:pb-5">
                            <label htmlFor="course-url"
                                   className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">Share the course
                                link below with your friends:</label>
                            <div className="relative mb-4">
                                <input id="course-url" type="text"
                                       className="col-span-6 bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       value="https://flowbite.com/docs/components/alerts/" disabled
                                       readOnly/>
                                <button data-copy-to-clipboard-target="course-url" data-tooltip-target="tooltip-course-url"
                                        className="absolute end-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center justify-center">
                        <span id="default-icon-course-url">
                            <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                 fill="currentColor" viewBox="0 0 18 20">
                                <path
                                    d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
                            </svg>
                        </span>
                                    <span id="success-icon-course-url" className="hidden">
                            <svg className="w-3.5 h-3.5 text-blue-700 dark:text-blue-500" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                            </svg>
                        </span>
                                </button>
                                <div id="tooltip-course-url" role="tooltip"
                                     className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                                    <span id="default-tooltip-message-course-url">Copy to clipboard</span>
                                    <span id="success-tooltip-message-course-url" className="hidden">Copied!</span>
                                    <div className="tooltip-arrow" data-popper-arrow></div>
                                </div>
                            </div>
                            <button type="button" data-modal-hide="course-modal"
                                    className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}