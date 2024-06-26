import React, { SetStateAction } from 'react';
import { Fragment, useState } from 'react';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

interface Props {
    setSelected: React.Dispatch<SetStateAction<any>>;
    selected: any;
    data: any;
};

const DropdownRelated = ({ setSelected, selected, data }: Props) => {
    let parsedTitle: any;

    if (data && data.length > 0) {
        parsedTitle = JSON.parse(data[0].title);

    }
    return (
        <div>
            {data && data?.length > 0 && <Listbox value={selected} onChange={setSelected}>
                {({ open }) => (
                    <>
                        <div className="relative mt-2">
                            <ListboxButton className="relative w-full cursor-default rounded-md bg-gray-50 py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:bg-gray-700">
                                <span className="flex items-center">
                                    <span className="ml-3 block truncate dark:text-white">{parsedTitle?.[1]?.en}</span>
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </span>
                            </ListboxButton>

                            <Transition show={open} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {data.map((project: any) => {
                                        console.log(project.title);
                                        const title = JSON.parse(project.title);
                                        return (
                                            <ListboxOption
                                                key={project.id}
                                                className={({ focus }) =>
                                                    clsx(
                                                        focus ? 'bg-indigo-600 text-white' : '',
                                                        !focus ? 'text-gray-900' : '',
                                                        'relative cursor-default select-none py-2 pl-3 pr-9'
                                                    )
                                                }
                                                value={project}
                                            >
                                                {({ selected, focus }) => (
                                                    <>
                                                        <div className="flex items-center">
                                                            <span
                                                                className={clsx(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                                            >
                                                                {title[1].en}
                                                            </span>
                                                        </div>

                                                        {selected ? (
                                                            <span
                                                                className={clsx(
                                                                    focus ? 'text-white' : 'text-indigo-600',
                                                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                )}
                                                            >
                                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                            </span>
                                                        ) : null}
                                                    </>
                                                )}
                                            </ListboxOption>
                                        );
                                    })}
                                </ListboxOptions>
                            </Transition>
                        </div>
                    </>
                )}
            </Listbox>}
        </div>
    );
};

export default DropdownRelated;
