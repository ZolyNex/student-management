import { useEffect, useState } from "react";
import {
  getStudentByStudentId,
  updateStudent,
} from "../../services/apiStudent";
import { useNavigate, useParams } from "react-router";
import { getConfig } from "../../utils/configHelper";
import { uploadAvatar } from "../../services/apiStorage";
import Loading from "../../ui/Loading";
import { toast } from "sonner";

export default function StudentEdit() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("alex");
  const [gender, setGender] = useState("male");
  const params = useParams();

  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
  );
  const [avatarFile, setAvatarFile] = useState(null);
  function handleAvatarChange(event) {
    const file = event.target.files[0];
    setAvatarFile(file);
    const newAvatar = URL.createObjectURL(file);
    setCurrentAvatarUrl(newAvatar);
  }
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const students = await getStudentByStudentId(params.id);
      const student = students[0];
      setName(student.name);
      setGender(student.gender);
      setCurrentAvatarUrl(student.avatar);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  async function onClick() {
    toast.loading("Updating Student...");
    const newStudent = {
      name,
      gender,
    };

    if (avatarFile) {
      // Build avatar filename
      const token = getConfig("SUPABASE_TOKEN");

      const userToken = JSON.parse(localStorage.getItem(token));
      const avatarFilename = `${userToken.user.email}-${Date.now()}.png`;

      // Upload avatar file
      await uploadAvatar(avatarFile, avatarFilename);

      // Build avatar access url
      const supabaseUrl = getConfig("SUPABASE_URL");
      const avatar = `${supabaseUrl}/storage/v1/object/public/avatar/public/${avatarFilename}`;

      newStudent.avatar = avatar;
    }
    const student = await updateStudent(params.id, newStudent);
    console.log(student);
    toast.dismiss();
    toast.success("Suceesful Updated Student");
    navigate("/home/student");
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

          <div className="space-y-4">
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
              Update Profile
            </button>
          </div>
        </div>
      )}
    </>
  );
}
