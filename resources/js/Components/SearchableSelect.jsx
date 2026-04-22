import { useState, Fragment } from 'react';
import { Combobox, Transition } from '@headlessui/react';

export default function SearchableSelect({
    options = [],
    value,
    onChange,
    placeholder = "Pilih data...",
    id,
    label,
    error,
    className = "",
    disabled = false
}) {
    const [query, setQuery] = useState('');

    const filteredOptions = query === ''
        ? options
        : options.filter((option) => {
            return option.label.toLowerCase().includes(query.toLowerCase());
        });

    const selectedOption = options.find(opt => opt.value === value) || null;

    return (
        <div className={`w-full space-y-2 ${className}`}>
            {label && (
                <label htmlFor={id} className="text-sm font-bold text-slate-500 uppercase tracking-widest block">
                    {label}
                </label>
            )}
            
            <Combobox value={value} onChange={onChange} disabled={disabled}>
                <div className="relative">
                    <div className="relative w-full cursor-default overflow-hidden rounded-xl bg-white text-left shadow-sm focus-within:ring-2 focus-within:ring-orange-500 transition-all duration-200 border border-slate-200">
                        <Combobox.Input
                            id={id}
                            className="w-full border-none py-2 pl-10 pr-10 text-slate-900 focus:ring-0 bg-slate-50 focus:bg-white transition-all placeholder:text-slate-400 text-sm font-medium"
                            displayValue={(val) => options.find(opt => opt.value === val)?.label || ''}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder={placeholder}
                        />
                        
                        {/* Search Icon */}
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <span className="material-symbols-outlined text-[18px]">
                                search
                            </span>
                        </div>

                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <span className="material-symbols-outlined text-slate-400 hover:text-orange-500 transition-colors">
                                unfold_more
                            </span>
                        </Combobox.Button>
                    </div>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                        afterLeave={() => setQuery('')}
                    >
                        <Combobox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-2 text-base shadow-2xl ring-1 ring-black/5 focus:outline-none sm:text-sm border border-slate-100">
                            {filteredOptions.length === 0 && query !== '' ? (
                                <div className="relative cursor-default select-none py-4 px-4 text-slate-500 text-center italic">
                                    Data tidak ditemukan.
                                </div>
                            ) : (
                                filteredOptions.map((option) => (
                                    <Combobox.Option
                                        key={option.value}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-3 pl-12 pr-4 transition-colors ${
                                                active ? 'bg-orange-50 text-orange-900 font-bold' : 'text-slate-700'
                                            }`
                                        }
                                        value={option.value}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span className={`block truncate ${selected ? 'font-bold text-orange-600' : 'font-normal'}`}>
                                                    {option.label}
                                                </span>
                                                
                                                {selected ? (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-orange-600 font-bold">
                                                        <span className="material-symbols-outlined text-[18px]">
                                                            check
                                                        </span>
                                                    </span>
                                                ) : active ? (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-orange-400/50">
                                                        <span className="material-symbols-outlined text-[18px]">
                                                            arrow_right
                                                        </span>
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>

            {error && (
                <p className="mt-2 text-sm font-bold text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}
