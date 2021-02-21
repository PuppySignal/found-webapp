// @Packages
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import qs from 'qs';
import cogoToast from 'cogo-toast';
import { RouteComponentProps } from 'react-router-dom';

// @Project
import PetService from 'services/PetService';
import { Pet } from 'interfaces/pet';

// @Own
import './styles.scss';
import { BackendResponse } from 'interfaces/app';
import { fetchPetImage } from 'utils';

interface IMatch {
  petId: any
};

interface IProps extends RouteComponentProps<IMatch> {}

const Found: React.FC<IProps> = ({
  match,
  location,
}) => {
  const history = useHistory();
  const [pet, setPet] = useState<Pet | undefined>();

  useEffect(() => {
    const { petId } = match.params;
    const { t } = qs.parse(location.search, { ignoreQueryPrefix: true }) as { t: string };

    if(!petId || !t) {
      cogoToast.warn('Page unavailable', { position: 'bottom-right' });
      
      history.push('/');
    }

    if(t) {
      PetService.scanned(petId, t)
      .then((response: BackendResponse) => {
        setPet(response.data);
      })
      .catch(() => {
        cogoToast.warn('Page unavailable', { position: 'bottom-right' });
        history.push('/');
      });
    }
  }, []);

  return (
    <div className="found">
      <h1 className="text-center">🐶</h1>
      <h3 className="text-center">Hmm, what do we have here?</h3>
      <img src={fetchPetImage(pet?.profile_picture)} className="found__photo" />
      <pre className="found__debug">{JSON.stringify(pet, undefined, 3)}</pre>
      <div className="d-flex flex-column">
        <button className="btn btn-sm btn-primary">Notify owner</button>
        <button className="btn btn-sm btn-primary my-2">Chat with the owner</button>
        <button className="btn btn-sm btn-danger">Send alert of lost dog in the zone!</button>
      </div>
    </div>
  );
}

export default Found;