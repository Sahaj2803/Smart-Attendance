// import React, { useRef, useState } from "react";

// export default function FacultyAvatar() {
//   const avatarRef = useRef(null);
//   const [rotation, setRotation] = useState({ x: 0, y: 0 });

//   const handleDoubleClick = () => {
//     const newX = rotation.x + 180;
//     const newY = rotation.y + 180;

//     avatarRef.current.style.transform = `rotateX(${newX}deg) rotateY(${newY}deg)`;
//     setRotation({ x: newX, y: newY });
//   };

//   return (
//     <div
//       ref={avatarRef}
//       onDoubleClick={handleDoubleClick}
//       className="w-48 h-64 transition-transform duration-700"
//       style={{
//         transformStyle: "preserve-3d",
//         perspective: "1000px",
//         cursor: "pointer",
//       }}
//     >
//       <img
//         src="feculty-avatar.png" // ✅ your saved image path
//         alt="Faculty"
//         className="w-full h-full object-contain rounded-xl shadow-2xl"
//       />
//     </div>
//   );
// }


import React from "react";

export default function FacultyAvatar() {
  return (
    <img
      src="feculty-avatar.png" // ✅ your saved image path
      alt="Faculty"
      className="w-48 h-auto object-contain rounded-xl shadow-2xl"
    />
  );
}
