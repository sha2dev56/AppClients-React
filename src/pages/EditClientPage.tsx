
import { useEffect, useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  IonToast,
  IonSpinner
} from '@ionic/react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClientsService } from '../services/ClientsService';
import { Client } from '../interfaces/Client';
import './EditClientPage.css';

export default function EditClientPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [client, setClient] = useState<Client>({
    name: '',
    email: '',
    phone: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const loadClient = async () => {
      try {
        const data = await ClientsService.getClient(Number(id));
        setClient(data);
      } catch (error) {
        console.error('Error al cargar cliente:', error);
        setMessage('No se ha podido cargar el cliente.');
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadClient();
    }
  }, [id]);

  const save = async () => {
    if (
      !client.name.trim() ||
      !client.email.trim() ||
      !client.phone.trim()
    ) {
      setMessage('Por favor, completa todos los campos.');
      setShowToast(true);
      return;
    }

    try {
      setSaving(true);

      await ClientsService.updateClient(Number(id), {
        name: client.name,
        email: client.email,
        phone: client.phone
      });

      navigate('/clients');
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      setMessage('No se ha podido actualizar el cliente.');
      setShowToast(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent className="edit-client-content">
          <div className="edit-loading">
            <IonSpinner />
            <p>Cargando cliente...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage className="edit-client-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Editar Cliente</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="edit-client-content">
        <div className="edit-client-container">

          <div className="edit-heading">
            <h1>Editar cliente</h1>
            <p>Modifica los datos del cliente seleccionado.</p>
          </div>

          <div className="edit-form">

            <div className="edit-field">
              <IonLabel className="edit-label">
                Nombre completo
              </IonLabel>
              <IonItem className="edit-input">
                <IonInput
                  value={client.name}
                  placeholder="Nombre del cliente"
                  onIonInput={(e) =>
                    setClient({
                      ...client,
                      name: e.detail.value ?? ''
                    })
                  }
                />
              </IonItem>
            </div>

            <div className="edit-field">
              <IonLabel className="edit-label">
                Correo electrónico
              </IonLabel>
              <IonItem className="edit-input">
                <IonInput
                  type="email"
                  value={client.email}
                  placeholder="Correo electrónico"
                  onIonInput={(e) =>
                    setClient({
                      ...client,
                      email: e.detail.value ?? ''
                    })
                  }
                />
              </IonItem>
            </div>

            <div className="edit-field">
              <IonLabel className="edit-label">
                Teléfono
              </IonLabel>
              <IonItem className="edit-input">
                <IonInput
                  type="tel"
                  value={client.phone}
                  placeholder="Teléfono"
                  onIonInput={(e) =>
                    setClient({
                      ...client,
                      phone: e.detail.value ?? ''
                    })
                  }
                />
              </IonItem>
            </div>

            <div className="edit-buttons">
              <IonButton
                expand="block"
                onClick={save}
                disabled={saving}
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </IonButton>

              <IonButton
                expand="block"
                fill="outline"
                color="medium"
                onClick={() => navigate('/clients')}
              >
                Cancelar
              </IonButton>
            </div>

          </div>
        </div>

        <IonToast
          isOpen={showToast}
          message={message}
          duration={2500}
          color="warning"
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
}
