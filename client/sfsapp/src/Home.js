import { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

function Home() {
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:9000/gs")
      .then((res) => {
        setInfo(res.data);
        setLoading(false);
      })
      .catch((err) => {
        alert("Could not load data: " + err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (r, f) => {
    if (window.confirm(`Delete student with Roll No ${r}? This cannot be undone.`))
      delStu(r, f);
  };

  const delStu = (r, f) => {
    axios
      .delete("http://localhost:9000/ds", { data: { r, f } })
      .then(() => {
        setInfo((prev) => prev.filter((item) => item.rno !== r));
      })
      .catch((err) => alert("Delete failed: " + err));
  };

  const dw = (f) => {
    saveAs("http://localhost:9000/uploads/" + f, f);
  };

  const handleEdit = (row) => {
    nav("/update", { state: { r: row.rno, n: row.name, m: row.marks } });
  };

  /* ── Marks colour helper (0-100 scale assumed) */
  const marksColor = (m) => {
    if (m >= 75) return "#10b981";
    if (m >= 50) return "#f59e0b";
    return "#f43f5e";
  };

  return (
    <div className="sms-home">
      {/* Header */}
      <div className="sms-home-header">
        <h1>Students</h1>
        {!loading && (
          <span className="sms-count-badge">
            {info.length} {info.length === 1 ? "record" : "records"}
          </span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="sms-empty">
          <div className="sms-empty-icon">⏳</div>
          <p>Loading records…</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && info.length === 0 && (
        <div className="sms-empty">
          <div className="sms-empty-icon">🎓</div>
          <p>No students yet. Add one to get started!</p>
        </div>
      )}

      {/* Table */}
      {!loading && info.length > 0 && (
        <div className="sms-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Marks</th>
                <th>Photo</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {info.map((e) => (
                <tr key={e.rno}>
                  {/* Roll No badge */}
                  <td>
                    <span className="sms-rno"># {e.rno}</span>
                  </td>

                  {/* Name */}
                  <td style={{ fontWeight: 600 }}>{e.name}</td>

                  {/* Marks with progress bar */}
                  <td>
                    <div className="sms-marks-wrap">
                      <span style={{ fontWeight: 700, minWidth: 32, color: marksColor(e.marks) }}>
                        {e.marks}
                      </span>
                      <div className="sms-marks-bar">
                        <div
                          className="sms-marks-fill"
                          style={{
                            width: `${Math.min(e.marks, 100)}%`,
                            background: `linear-gradient(90deg, ${marksColor(e.marks)}, ${marksColor(e.marks)}aa)`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Photo */}
                  <td>
                    <img
                      src={"http://localhost:9000/uploads/" + e.file}
                      alt={e.name}
                      className="timg"
                      onError={(ev) => {
                        ev.target.style.display = "none";
                      }}
                    />
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="sms-actions">
                      <button
                        className="sms-btn sms-btn-edit"
                        onClick={() => handleEdit(e)}
                        title="Edit student"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="sms-btn sms-btn-success"
                        onClick={() => dw(e.file)}
                        title="Download file"
                      >
                        ⬇ Download
                      </button>
                      <button
                        className="sms-btn sms-btn-danger"
                        onClick={() => handleDelete(e.rno, e.file)}
                        title="Delete student"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Home;