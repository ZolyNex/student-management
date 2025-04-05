import { useEffect, useState } from "react";
import { getConfig } from "../../utils/configHelper";
import { getTeacherByTeacherId } from "../../services/apiTeachers";
import { createStudent } from "../../services/apiStudent";
import { signup } from "../../services/apiAuth";
import { useNavigate } from "react-router";
import Loading from "../../ui/Loading";
import { toast } from "sonner";

export default function StudentCreate() {
  const navigate = useNavigate();
  const [name, setName] = useState("some");
  const [email, setEmail] = useState("some@gmail.com");
  const [teacherId, setTeacherId] = useState("");
  const [classInChargeArr, setClassInChargeArr] = useState([]);
  const [classInfo, setClassInfo] = useState("x | x");
  const [gender, setGender] = useState("male");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getConfig("SUPABASE_TOKEN");
    const userToken = JSON.parse(localStorage.getItem(token));
    if (!userToken) return;
    setTeacherId(userToken.user.id);
    async function fetchData() {
      setIsLoading(true);
      const teachers = await getTeacherByTeacherId(userToken.user.id);
      const teacher = teachers[0];
      const classInChargeArrData = await JSON.parse(teacher.class_in_char);

      setClassInChargeArr(classInChargeArrData);
      setClassInfo(classInChargeArrData[0]);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  async function onClick() {
    toast.loading("Create Student...");
    const userData = await signup(email, "123456", { isStudent: true });

    const students = await createStudent({
      name,
      class: classInfo.split("|")[0],
      grade: classInfo.split("|")[1],
      gender,
      teacher_id: teacherId,
      avatar:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      student_id: userData.user.id,
    });
    console.log(students);
    toast.dismiss();
    toast.success("Suceesful Create Student");
    navigate("/home/student");
  }

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <div className="w-full max-w-sm mx-auto shadow-2xl shadow-purple-300 rounded-box mt-20 p-6">
          <div className="space-y-4 pt-4">
            <label className="input input-bordered flex items-center gap-2 w-full">
              Email
              <input
                type="text"
                className="grow w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="input input-bordered flex items-center gap-2 w-full">
              Name
              <input
                type="text"
                className="grow w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <select
              className="select select-bordered w-full"
              value={classInfo}
              onChange={(e) => setClassInfo(e.target.value)}
            >
              <option disabled>Choose Class</option>
              {classInChargeArr.map((item) => (
                <option key={item} value={item}>
                  Class {item.split("|")[0]} | Year {item.split("|")[1]}
                </option>
              ))}
            </select>

            <select
              className="select select-bordered w-full"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option disabled>Choose Gender</option>
              <option>male</option>
              <option>female</option>
            </select>
          </div>

          <div className="flex justify-center mt-4">
            <button className="btn btn-primary w-full" onClick={onClick}>
              Create Student
            </button>
          </div>
        </div>
      )}
    </>
  );
}
