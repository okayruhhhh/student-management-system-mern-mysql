import { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function Update() {
  const loc = useLocation();
  const nav = useNavigate();

  const rRno   = useRef();
  const rName  = useRef();
  const rMarks = useRef();

  const [rno,    setRno]    = useState(loc.state?.r ?? "");
  const [name,   setName]   = useState(loc.state?.n ?? "");
  const [marks,  setMarks]  = useState(loc.state?.m ?? "");
  const [saving, setSaving] = useState(false);

  const save = (event) => {
    event.preventDefault();

    if (!rno.toString().trim()) {
      toast.error("Roll No is required");
      rRno.current.focus();
      return;
    }
    if (!name.trim()) {
      toast.error("Student name is required");
      rName.current.focus();
      return;
    }
    if (!marks.toString().trim()) {
      toast.error("Marks are required");
      rMarks.current.focus();
      return;
    }

    setSaving(true);
    axios
      .put("http://localhost:9000/us", { rno, name, marks })
      .then(() => {
        toast.success("Record updated!");
        setTimeout(() => nav("/"), 800);
      })
      .catch((err) => {
        setSaving(false);
        toast.error("Update failed: " + err.message);
      });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="sms-page">
        <div className="sms-card">

          {/* Header */}
          <div className="sms-card-header">
            <div className="sms-card-icon">✏️</div>
            <h1>Edit Student</h1>
          </div>

          <form onSubmit={save} noValidate>

            <div className="sms-field">
              <label htmlFor="upd-rno">Roll Number</label>
              <input
                id="upd-rno"
                type="number"
                placeholder="Roll No"
                ref={rRno}
                value={rno}
                onChange={(e) => setRno(e.target.value)}
                readOnly
                style={{ background: "#f1f5f9", color: "#64748b", cursor: "not-allowed" }}
              />
            </div>

            <div className="sms-field">
              <label htmlFor="upd-name">Full Name</label>
              <input
                id="upd-name"
                type="text"
                placeholder="Student name"
                ref={rName}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="sms-field">
              <label htmlFor="upd-marks">Marks</label>
              <input
                id="upd-marks"
                type="number"
                placeholder="0 – 100"
                ref={rMarks}
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                min="0"
                max="100"
              />
            </div>

            <input
              type="submit"
              value={saving ? "Updating…" : "Save Changes"}
              disabled={saving}
              style={saving ? { opacity: 0.7, cursor: "not-allowed" } : {}}
            />

            <button
              type="button"
              onClick={() => nav("/")}
              style={{
                marginTop: 12,
                width: "100%",
                padding: "12px",
                background: "transparent",
                border: "1.5px solid #e2e8f0",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
                color: "#64748b",
                fontFamily: "inherit",
                transition: "all .2s",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#f1f5f9")}
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Update;