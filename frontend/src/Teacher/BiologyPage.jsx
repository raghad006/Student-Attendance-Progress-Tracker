import React from "react";
import { useNavigate } from "react-router-dom";

export default function BiologyPage() {
  const navigate = useNavigate();
  
  const students = [
    {
      name: "Alex Johnson",
      id: "ID-98765",
      grade: 4.2,
      note: "Active participant in class.",
      avatar: ""
    },
    {
      name: "Brenda Smith",
      id: "ID-98764",
      grade: 3.7,
      note: "Add note...",
      avatar: ""
    },
    {
      name: "Carlos Gomez",
      id: "ID-98763",
      grade: 3.0,
      note: "Arrived 10 minutes late.",
      avatar: ""
    },
    {
      name: "Diana Prince",
      id: "ID-98762",
      grade: 4.8,
      note: "Excellent work on lab.",
      avatar: ""
    },
    {
      name: "Ethan Hunt",
      id: "ID-98761",
      grade: 2.7,
      note: "Doctor's appointment.",
      avatar: ""
    }
  ];

  const getGradeColor = (grade) => {
    if (grade >= 4.5) return 'text-green-600';
    if (grade >= 3.5) return 'text-blue-600';
    if (grade >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start">
      <div className="w-full max-w-7xl mx-auto p-8">
        <div className="flex flex-col items-center mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition-colors mb-4 self-start"
          >
            ← Back to Dashboard
          </button>
          
          <div className="w-full flex justify-between items-center">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Biology 101 - Fall 2024
              </h1>
              <p className="text-gray-600">
                Manage student grades and notes.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <input 
            type="text" 
            placeholder="🔍 Search by name or ID..." 
            className="px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-400 focus:outline-none w-64"
          />
          <input 
            type="date" 
            className="px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-400 focus:outline-none"
          />
          <button className="bg-purple-400 text-white px-6 py-3 rounded-xl hover:bg-purple-500 transition-colors">
            ➕ Add Student
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="pb-4 text-left text-gray-500 font-semibold">Student Name</th>
                <th className="pb-4 text-left text-gray-500 font-semibold">Student ID</th>
                <th className="pb-4 text-left text-gray-500 font-semibold">Grade /5</th>
                <th className="pb-4 text-left text-gray-500 font-semibold">Notes</th>
                <th className="pb-4 text-left text-gray-500 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index} className="border-b border-gray-100 last:border-b-0">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={student.avatar || "/user.png"} 
                        alt={student.name}
                        className="w-10 h-10 rounded-full"
                        onError={(e) => {
                          e.target.src = "/user.png";
                        }}
                      />
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-gray-700">{student.id}</td>
                  <td className="py-4">
                    <span className={`text-xl font-bold ${getGradeColor(student.grade)}`}>
                      {student.grade.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">/5</span>
                  </td>
                  <td className="py-4">
                    <input 
                      type="text" 
                      defaultValue={student.note}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-400 focus:outline-none"
                    />
                  </td>
                  <td className="py-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center gap-4">
          <button className="bg-purple-400 text-white px-8 py-3 rounded-xl hover:bg-purple-500 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}