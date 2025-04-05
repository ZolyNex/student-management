import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getScoreByScoreId, updataScore } from "../../services/apiScore";
import { getStudentByStudentId } from "../../services/apiStudent";
import Loading from "../../ui/Loading";
import { toast } from "sonner";

export default function ScoreEdit() {
  const params = useParams();
  const navigate = useNavigate();
  const [score, setScore] = useState(80);
  const [subject, setSubject] = useState("Mathematics");
  const [semesterYear, setSemesterYear] = useState(new Date().getFullYear());
  const [semesterSeason, setSemesterSeason] = useState("Spring");
  const [isLoading, setIsLoading] = useState(true);
  const [currentstudent, setCurrentStudent] = useState({
    name: "Someone",
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
      const scores = await getScoreByScoreId(params.id);
      const scoreData = scores[0];
      setScore(scoreData.score);
      setSubject(scoreData.subject);
      setSemesterYear(scoreData.semesterYear);
      setSemesterSeason(scoreData.semesterSeason);

      const students = await getStudentByStudentId(scoreData.student_id);
      const student = students[0];
      setCurrentStudent(student);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  async function onClick() {
    toast.loading("Updating Score...");
    const newScore = {
      score,
      subject,
      semesterYear,
      semesterSeason,
    };
    const scores = await updataScore(params.id, newScore);
    console.log(scores);
    toast.dismiss();
    toast.success("Suceesful Updated Score");
    navigate("/home/score");
  }

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <div className="w-full max-w-sm mx-auto shadow-2xl shadow-purple-300 rounded-box mt-20 p-6">
          <h1 className="text-center text-3xl mb-4">{currentstudent.name}</h1>

          <div className="space-y-4">
            <label className="input input-bordered flex items-center gap-2 w-full">
              Class
              <input
                type="text"
                className="grow w-full"
                value={`Class ${currentstudent.class} | Year ${currentstudent.grade}`}
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
              Update Score
            </button>
          </div>
        </div>
      )}
    </>
  );
}
