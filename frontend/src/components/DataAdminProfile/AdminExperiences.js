import { useEffect, useState } from 'react';
import { getAxios } from '../../axiosCalls';
import AdminExperiencesItem from './AdminExperienceItem';
import { onlyUnique } from '../../helpers';

function AdminExperiences() {
  const [experienceInfo, setExperienceInfo] = useState();
  const [categories, setCategories] = useState();

  useEffect(() => {
    async function getInfoExperiences() {
      try {
        const { data } = await getAxios('http://https://bf8t0s9gnh.execute-api.us-east-1.amazonaws.com:8080/experiences');
        const categories = data.map((category) => category.categoria);
        const allCategories = categories.filter(onlyUnique);
        setCategories(allCategories);
        setExperienceInfo(data);
      } catch (error) {
        console.error(error.response?.data?.message);
      }
    }

    getInfoExperiences();
  }, []);

  return (
    <table className="tableData">
      <tbody>
        {experienceInfo?.map((experience) => (
          <AdminExperiencesItem
            key={experience.id}
            categories={categories}
            experience={experience}
            updateDataExp={setExperienceInfo}
          />
        ))}
      </tbody>
    </table>
  );
}

export default AdminExperiences;
