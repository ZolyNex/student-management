import { useEffect, useState } from "react";
import { getUserId } from "../../utils/userHelpr";
import { getStudentList } from "../../services/apiStudent";
import { createScore } from "../../services/apiScore";
import Loading from "../../ui/Loading";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function ScoreUpload() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(80);
  const [subject, setSubject] = useState("Mathematics");
  const [semesterYear, setSemesterYear] = useState(new Date().getFullYear());
  const [semesterSeason, setSemesterSeason] = useState("Spring");
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState({
    name: "someone",
    student_id: "123456789",
    class: "x",
    grade: "x",
  });

  const yearList = Array.from(
    { length: new Date().getFullYear() - 2020 + 1 },
    (_, idx) => 2020 + idx
  );

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const userId = getUserId();
      const studentList = await getStudentList(userId);
      setCurrentStudent(studentList[0]);
      setStudents(studentList);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  async function onClick() {
    toast.loading("Upload Score...");
    const newScore = {
      student_id: currentStudent.student_id,
      score,
      subject,
      semesterYear,
      semesterSeason,
    };

    const scores = await createScore(newScore);
    console.log(scores);
    toast.dismiss();
    toast.success("Suceesful Create Student");
    navigate("/home/score");
  }

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <div className="w-full max-w-sm mx-auto shadow-2xl shadow-purple-300 rounded-box mt-20 p-6">
          <div className="space-y-4 pt-4">
            <select
              className="select select-bordered w-full mb-2"
              value={currentStudent.student_id}
              onChange={(e) => {
                const selectedStudent = students.find(
                  (student) => student.student_id === e.target.value
                );

                setCurrentStudent(selectedStudent);
              }}
            >
              <option disabled>Choose Student</option>
              {students.map((student, idx) => (
                <option key={idx} value={student.student_id}>
                  {student.name}
                </option>
              ))}
            </select>

            <label className="input input-bordered flex items-center gap-2 w-full">
              Class
              <input
                type="text"
                className="grow w-full"
                value={`Class ${currentStudent.class} | Year ${currentStudent.grade}`}
                disabled
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 w-full">
              Student ID
              <input
                type="text"
                className="grow w-full"
                value={currentStudent.student_id}
                disabled
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 w-full">
              Score
              <input
                type="number"
                className="grow w-full"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
              />
            </label>

            <select
              className="select select-bordered w-full"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option disabled>Choose Subject</option>
              <option>Mathematics</option>
              <option>English</option>
              <option>Science</option>
              <option>History</option>
              <option>Geography</option>
              <option>Art</option>
              <option>Music</option>
              <option>Sports</option>
            </select>

            <div className="flex gap-cols-2 gap-4">
              <select
                className="select select-bordered w-full"
                value={semesterYear}
                onChange={(e) => setSemesterYear(e.target.value)}
              >
                <option disabled>Choose Year</option>
                {yearList.map((year) => {
                  return <option key={year}>{year}</option>;
                })}
              </select>

              <select
                className="select select-bordered w-full"
                value={semesterSeason}
                onChange={(e) => setSemesterSeason(e.target.value)}
              >
                <option disabled>Choose Season</option>
                <option>Spring</option>
                <option>Fall</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button className="btn btn-primary w-full" onClick={onClick}>
              Upload Score
            </button>
          </div>
        </div>
      )}
    </>
  );
}
