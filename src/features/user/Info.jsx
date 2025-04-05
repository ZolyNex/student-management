import { useEffect, useState } from "react";
import { uploadAvatar } from "../../services/apiStorage";
import { useAtom, useAtomValue } from "jotai";
import { isStudentAtom, userAtom } from "../../atoms/user";
import { getTeacherByTeacherId } from "../../services/apiTeachers";
import { getUserId } from "../../utils/userHelpr";
import Loading from "../../ui/Loading";
import { toast } from "sonner";
import { getConfig } from "../../utils/configHelper";
import { updateUser } from "../../services/apiAuth";
import { useNavigate } from "react-router";
import { updateStudent } from "../../services/apiStudent";
export default function Info() {
  const navigate = useNavigate();
  const [user, setUser] = useAtom(userAtom);
  const isStudent = useAtomValue(isStudentAtom);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(user.avatar);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentAvatarUrl(user.avatar);
  }, [user]);

  const [classInChargeArr, setClassInChargeArr] = useState([]);

  useEffect(() => {
    if (isStudent === null) return;

    async function fetchData() {
      setIsLoading(true);
      if (!isStudent) {
        const userId = getUserId();
        const teachers = await getTeacherByTeacherId(userId);
        const teacher = await teachers[0];
        setClassInChargeArr(JSON.parse(teacher.class_in_char));
      }

      setIsLoading(false);
    }
    fetchData();
  }, [isStudent]);

  function handleAvatarChange(event) {
    const file = event.target.files[0];
    setAvatarFile(file);
    const newAvatar = URL.createObjectURL(file);
    setCurrentAvatarUrl(newAvatar);
  }
  async function onClick() {
    toast.loading("Updating Info...");
    if (!avatarFile) {
      return;
    }
    const token = getConfig("SUPABASE_TOKEN");
    const userToken = JSON.parse(localStorage.getItem(token));
    const avatarFilename = `${userToken.user.email}-${Date.now()}.png`;
    await uploadAvatar(avatarFile, avatarFilename);
    const supabaseUrl = getConfig("SUPABASE_URL");
    const newAvatarUrl = `${supabaseUrl}/storage/v1/object/public/avatar/public/${avatarFilename}`;
    const newUserMetadata = await updateUser({ avatar: newAvatarUrl });
    const userId = getUserId();
    if (isStudent) {
      const newStudents = await updateStudent(userId, {
        avatar: newAvatarUrl,
      });
      console.log(newStudents);
    }

    setUser(newUserMetadata.user.user_metadata);
    toast.dismiss();
    toast.success("Suceesful Updated Info");
    navigate("/");
  }

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <div className="w-full max-w-sm mx-auto shadow-2xl shadow-purple-300 rounded-box mt-20 p-6">
          <div className="avatar my-4 flex justify-center">
            <div className="w-24 rounded-full">
              <label htmlFor="avatar-input" cursor-pointer>
                <img src={currentAvatarUrl} />
              </label>
            </div>
          </div>

          <input
            type="file"
            id="avatar-input"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />

          <div className="w-full">
            <label className="input input-bordered flex items-center gap-2 my-3 w-full">
              <svg
                className="h-[1em] opacity-50"
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
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </g>
              </svg>
              <input type="text" className="grow" value="alex" disabled />
            </label>

            {classInChargeArr.length > 0 && (
              <ul className="menu bg-base-200 rounded-box w-full">
                <li className="w-full">
                  <details open className="w-full">
                    <summary className="w-full">Class In Charge</summary>
                    <ul className="w-full">
                      {classInChargeArr.map((classInCharge, index) => (
                        <li key={index} className="w-full">
                          <a className="pointer-events-none w-full">
                            Class {classInCharge.split("|")[0]} | Year{" "}
                            {classInCharge.split("|")[1]}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              </ul>
            )}
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-3 text-center mt-1">
            <button
              className="btn btn-primary w-full md:w-auto"
              onClick={onClick}
            >
              Update Avatar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
