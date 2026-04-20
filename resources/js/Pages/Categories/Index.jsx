import React from "react";
import { Head } from "@inertiajs/react";

export default function Index({ categories }) {
    return (
        <div className="py-12">
            <Head title="Categories" />
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Master Kategori
                    </h2>
                    {/* Placeholder table */}
                    <table className="min-w-full divide-y divide-gray-200 mt-4">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Nama
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {categories?.map((category) => (
                                <tr key={category.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {category.name}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-indigo-600 hover:text-indigo-900">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
