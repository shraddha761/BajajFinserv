import React, { useState } from 'react';

const App = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleJsonChange = (e) => {
        setJsonInput(e.target.value);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const parsedJson = JSON.parse(jsonInput);
            if (!parsedJson || !Array.isArray(parsedJson.data)) {
                throw new Error('Invalid JSON format');
            }

            const response = await fetch('http://localhost:3000/bfhl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: parsedJson.data,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setResponseData(data);
            setShowDropdown(true);
            setError('');
        } catch (err) {
            setError(err.message || 'Invalid JSON input');
            setShowDropdown(false);
            setResponseData(null);
        }
    };

    const handleOptionSelect = (e) => {
        const selectedValues = Array.from(e.target.selectedOptions).map(option => option.value);
        setSelectedOptions(selectedValues);
    };

    const renderSelectedData = () => {
        if (!responseData) return null;

        return selectedOptions.map(option => {
            switch(option) {
                case 'Alphabets':
                    return (
                        <div key="alphabets" className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                            <h3 className="font-bold text-lg">Alphabets:</h3>
                            <pre>{JSON.stringify(responseData.alphabets, null, 2)}</pre>
                        </div>
                    );
                case 'Numbers':
                    return (
                        <div key="numbers" className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                            <h3 className="font-bold text-lg">Numbers:</h3>
                            <pre>{JSON.stringify(responseData.numbers, null, 2)}</pre>
                        </div>
                    );
                case 'Highest lowercase alphabet':
                    return (
                        <div key="highest-alphabet" className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                            <h3 className="font-bold text-lg">Highest Lowercase Alphabet:</h3>
                            <pre>{JSON.stringify(responseData.highest_alphabet, null, 2)}</pre>
                        </div>
                    );
                default:
                    return null;
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-6 px-4">
            <div className="w-full max-w-lg bg-white shadow-xl rounded-lg p-8">
                <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">JSON Input Processor</h1>
                <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center">
                    <textarea
                        className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder='Enter JSON (e.g., {"data": ["A", "B", 1, 2, 3]})'
                        value={jsonInput}
                        onChange={handleJsonChange}
                        rows={6}
                    />
                    <button 
                        type="submit" 
                        className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                    >
                        Process JSON
                    </button>
                </form>

                {error && (
                    <div className="mt-4 p-4 bg-red-200 border border-red-400 text-red-700 rounded-lg text-center">
                        {error}
                    </div>
                )}

                {showDropdown && (
                    <div className="mt-6">
                        <label className="block text-gray-700 font-medium mb-2">Select Data to View:</label>
                        <select 
                            multiple 
                            onChange={handleOptionSelect}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Alphabets">Alphabets</option>
                            <option value="Numbers">Numbers</option>
                            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
                        </select>
                    </div>
                )}

                {responseData && (
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4 text-center">Response Data:</h3>
                        {renderSelectedData()}
                    </div>
                )}
            </div>
        </div>
    );
};
export default App;
