import { useEffect, useState } from "react";
import { getStudentList } from "../../services/apiStudent";
import StudentListItem from "./StudentListItem";
import { getUserId } from "../../utils/userHelpr";
import Loading from "../../ui/Loading";
import { useLocation, useNavigate } from "react-router";
import { useAtomValue } from "jotai";
import { isStudentAtom } from "../../atoms/user";

export default function StudentList() {
  const [StudentList, setStudentList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const location = useLocation();
  const isStudent = useAtomValue(isStudentAtom);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const userId = getUserId();
      const studentList = await getStudentList(userId);
      setStudentList(studentList || []);
      setFilteredList(studentList || []);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = StudentList.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toString().includes(searchTerm) ||
      student.grade.toString().includes(searchTerm)
    );
    setFilteredList(filtered);
    setCurrentPage(1);
  }, [searchTerm, StudentList]);

  const handleDelete = (studentId) => {
    setStudentList(StudentList.filter(student => student.student_id !== studentId));
  };

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredList.slice(startIndex, endIndex);

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <div className="space-y-6 mt-8">
          {/* Search box and button */}
          <div className="flex justify-center items-center gap-4 w-full">
            <div className="flex items-center w-96">
              <label className="input input-bordered flex items-center gap-2 flex-grow">
                <svg
                  className="h-4 w-4 opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </g>
                </svg>
                <input
                  type="search"
                  required
                  placeholder="Search students..."
                  className="w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </label>
            </div>
            {!isStudent && (
              <button className="btn btn-primary" onClick={() => navigate("/home/student/create")}>
                Create Student
              </button>
            )}
          </div>

          {/* Student list */}
          <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
            <table className="table table-lg">
              <thead>
                <tr>
                  {!isStudent && (
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                  )}
                  <th>Name</th>
                  <th>Class</th>
                  {!isStudent && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((studentListItem) => (
                  <StudentListItem
                    key={studentListItem.id}
                    studentListItem={studentListItem}
                    onDelete={handleDelete}
                    isStudent={isStudent}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center">
            <div className="join">
              <button 
                className="join-item btn" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                «
              </button>
              <button className="join-item btn">
                Page {currentPage} of {totalPages}
              </button>
              <button 
                className="join-item btn" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
