// Users can only access their own school
module.exports = (req, res, next) => {
  const { role, school_id } = req.user;
  const requestedSchoolId = req.params.schoolId;

  if (role === "admin") return next();
  if (school_id === requestedSchoolId) return next();

  return res.status(403).json({ message: "Forbidden: cannot view other schools' transactions" });
};
