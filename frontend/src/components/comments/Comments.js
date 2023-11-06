import StyledComments from './StyledComments';
import CommentUser from './CommentUser';
import { useEffect, useState } from 'react';
import { getAxios } from '../../axiosCalls';

function Comments({ comment }) {
  const [appreciationComment, setAppreciationComment] = useState([]);

  useEffect(() => {
    async function getComment_Rating() {
      try {
        const { data } = await getAxios(
          `http://3.87.209.149:8080/bookings/comments-ratings/${comment.id}`
        );
        setAppreciationComment(data);
      } catch (error) {
        console.error(error.message);
      }
    }

    getComment_Rating();
  }, [comment.id]);

  return (
    <StyledComments>
      <h3>Valoración y opiniones</h3>
      <section>
        {appreciationComment.appreciations_comments &&
          appreciationComment.appreciations_comments.map((data) => (
            <CommentUser key={data.id} appreciationComment={data} />
          ))}
      </section>
    </StyledComments>
  );
}
export default Comments;
