import React from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

type DropboxProps = {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

const Dropbox = ({ options, selected, onChange }: DropboxProps) => {
  return (
    <Menu as="div" className="relative inline-block text-left w-full max-w-xs">
      
      {/* Menu Trigger Button */}
      <MenuButton className="inline-flex w-full items-center justify-between gap-x-2 rounded-xl bg-slate-950/60 border border-purple-500/30 px-4 py-3 text-sm font-semibold text-gray-200 shadow-inner hover:bg-slate-900/60 transition-all duration-200 outline-none focus:ring-2 focus:ring-purple-500/50">
        <span className={selected === options[0] ? 'text-gray-500 font-normal' : 'text-cyan-400'}>
          {selected || "Select an option"}
        </span>
        <ChevronDownIcon
          aria-hidden="true"
          className="size-5 text-purple-400 transition-transform duration-200 group-data-[open]:rotate-180"
        />
      </MenuButton>

      {/* Dropdown Options Box */}
      <MenuItems
        transition
        className="absolute left-0 z-20 mt-2 w-full origin-top-left rounded-xl bg-slate-900 border border-slate-800 p-1.5 shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[enter]:ease-out data-[leave]:duration-75 data-[leave]:ease-in"
      >
        <div className="space-y-1">
          {options.map((option) => {
            const isPlaceholder = option === options[0];
            const isSelected = selected === option;

            return (
              <MenuItem key={option} disabled={isPlaceholder}>
                <button
                  type="button"
                  onClick={() => onChange(option)}
                  className={`block w-full px-4 py-2.5 text-left text-sm rounded-lg transition-colors cursor-pointer data-[focus]:bg-purple-600 data-[focus]:text-white ${
                    isPlaceholder
                      ? "text-gray-600 border-b border-slate-800/60 font-medium cursor-not-allowed mb-1 pointer-events-none"
                      : isSelected
                      ? "bg-purple-900/40 text-cyan-400 font-semibold"
                      : "text-gray-300"
                  }`}
                >
                  {option}
                </button>
              </MenuItem>
            );
          })}
        </div>
      </MenuItems>
    </Menu>
  )
}

export default Dropbox;