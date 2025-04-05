import { useEffect, useState } from "react";
import ScoreListItem from "./ScoreListItem";
import { getScoreList, deleteScore } from "../../services/apiScore";
import { getStudentByStudentId, getStudentList } from "../../services/apiStudent";
import { getUserId } from "../../utils/userHelpr";
import Loading from "../../ui/Loading";
import { useAtomValue } from "jotai";
import { isStudentAtom } from "../../atoms/user";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function ScoreList() {
  const isStudent = useAtomValue(isStudentAtom);
  const [scoreList, setScoreList] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    if (isStudent === null) return;
    async function fetchData() {
      setIsLoading(true);
      const userId = getUserId();

      const scoreListData = await getScoreList();
      setScoreList(scoreListData || []);
      if (!isStudent) {
        const studentList = await getStudentList(userId);
        setStudents(studentList || []);
      } else {
        const studentList = await getStudentByStudentId(userId);
        setStudents(studentList || []);
      }

      setIsLoading(false);
    }
    fetchData();
  }, [isStudent]);

  const filteredScoreList = scoreList
    .filter((scoreItem) => {
      const student = students.find(
        (student) => student.student_id === scoreItem.student_id
      );
      if (!student) return false;
      return (
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class.toString().includes(searchTerm) ||
        student.grade.toString().includes(searchTerm) ||
        scoreItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scoreItem.score.toString().includes(searchTerm)
      );
    })
    .sort((a, b) => {
      const studentA = students.find(
        (student) => student.student_id === a.student_id
      );
      const studentB = students.find(
        (student) => student.student_id === b.student_id
      );
      return studentA.name.localeCompare(studentB.name);
    });

  const totalPages = Math.ceil(filteredScoreList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredScoreList.slice(startIndex, endIndex);

  const handleDelete = async (scoreId) => {
    try {
      await deleteScore(scoreId);
      setScoreList(scoreList.filter(score => score.id !== scoreId));
      toast.success("Score deleted successfully");
    } catch (error) {
      toast.error("Failed to delete score");
    }
  };

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
                  placeholder="Search scores..."
                  className="w-full"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </label>
            </div>
            {!isStudent && (
              <button className="btn btn-primary" onClick={() => navigate("/home/score/upload")}>
                Upload Score
              </button>
            )}
          </div>

          {/* Score list */}
          <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
            <table className="table table-auto">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Semester</th>
                  <th>Score</th>
                  {!isStudent && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((scoreItem) => (
                  <tr key={scoreItem.id}>
                    <td>{students.find(s => s.student_id === scoreItem.student_id)?.name}</td>
                    <td>
                      {`Class ${students.find(s => s.student_id === scoreItem.student_id)?.class} | Year ${students.find(s => s.student_id === scoreItem.student_id)?.grade} `}
                    </td>
                    <td>{scoreItem.subject}</td>
                    <td>
                      {scoreItem.semesterSeason} {scoreItem.semesterYear}
                    </td>
                    <td>{scoreItem.score}</td>
                    {!isStudent && (
                      <td className="flex gap-2">
                        <button 
                          className="btn btn-ghost btn-sm" 
                          onClick={() => navigate(`/home/score/${scoreItem.id}`)}
                        >
                          Details
                        </button>
                        <button 
                          className="btn btn-error btn-sm" 
                          onClick={() => handleDelete(scoreItem.id)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
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
