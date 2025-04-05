import { useNavigate } from "react-router";
import { deleteStudent } from "../../services/apiStudent";
import { toast } from "sonner";

export default function StudentListItem({ studentListItem, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (!confirmed) return;

    const success = await deleteStudent(studentListItem.student_id);
    if (success) {
      toast.success("Successfully deleted student");
      onDelete(studentListItem.student_id);
    } else {
      toast.error("Error deleting student");
    }
  };

  return (
    <tr>
      <th>
        <label>
          <input type="checkbox" className="checkbox" />
        </label>
      </th>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <img
                src={studentListItem.avatar}
                alt="Avatar Tailwind CSS Component"
              />
            </div>
          </div>
          {/* name and gender */}
          <div>
            <div className="font-bold">{studentListItem.name}</div>
            <div className="text-sm opacity-50">{studentListItem.gender}</div>
          </div>
        </div>
      </td>
      {/* class and room teacher */}
      <td>
        Class{studentListItem.class} | Year {studentListItem.grade}
      </td>
      <th>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() =>
            navigate(`/home/student/${studentListItem.student_id}`)
          }
        >
          Details
        </button>
        <button className="btn btn-error btn-sm" onClick={handleDelete}>
          Delete
        </button>
      </th>
    </tr>
  );
}
