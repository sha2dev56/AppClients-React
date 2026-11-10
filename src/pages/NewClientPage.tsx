
import { useState } from 'react';
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
  IonToast
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { ClientsService } from '../services/ClientsService';
import { Client } from '../interfaces/Client';
import './NewClientPage.css';

export default function NewClientPage() {
  const navigate = useNavigate();

  const [client, setClient] = useState<Client>({
    name: '',
    email: '',
    phone: ''
  });

  const [showToast, setShowToast] = useState(false);

  const save = async () => {
    if (!client.name.trim() || !client.email.trim() || !client.phone.trim()) {
      setShowToast(true);
      return;
    }

    try {
      await ClientsService.addClient(client);
      navigate('/clients');
    } catch (error) {
      console.error('Error al guardar cliente:', error);
    }
  };

  return (
    <IonPage className="new-client-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Nuevo Cliente</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="new-client-content">
        <div className="new-client-container">

          <div className="form-heading">
            <h1>Añadir cliente</h1>
            <p>Introduce los datos del nuevo cliente.</p>
          </div>

          <div className="client-form">

            <div className="form-field">
              <IonLabel className="form-label">Nombre completo</IonLabel>
              <IonItem className="form-input">
                <IonInput
                  value={client.name}
                  placeholder="Ej. María García"
                  onIonInput={(e) =>
                    setClient({ ...client, name: e.detail.value ?? '' })
                  }
                />
              </IonItem>
            </div>

            <div className="form-field">
              <IonLabel className="form-label">Correo electrónico</IonLabel>
              <IonItem className="form-input">
                <IonInput
                  type="email"
                  value={client.email}
                  placeholder="Ej. maria@email.com"
                  onIonInput={(e) =>
                    setClient({ ...client, email: e.detail.value ?? '' })
                  }
                />
              </IonItem>
            </div>

            <div className="form-field">
              <IonLabel className="form-label">Teléfono</IonLabel>
              <IonItem className="form-input">
                <IonInput
                  type="tel"
                  value={client.phone}
                  placeholder="Ej. 600 123 456"
                  onIonInput={(e) =>
                    setClient({ ...client, phone: e.detail.value ?? '' })
                  }
                />
              </IonItem>
            </div>

            <div className="form-buttons">
              <IonButton expand="block" onClick={save}>
                Guardar cliente
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
          message="Por favor, completa todos los campos."
          duration={2000}
          color="warning"
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
}
