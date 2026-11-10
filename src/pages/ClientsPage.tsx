
import { useEffect, useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonAlert,
  IonCard,
  IonCardContent,
  IonText
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { ClientsService } from '../services/ClientsService';
import { Client } from '../interfaces/Client';
import './ClientsPage.css';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const navigate = useNavigate();

  const loadClients = async () => {
    try {
      const data = await ClientsService.getClients();
      setClients(data ?? []);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const deleteClient = async () => {
    if (selectedId === null) return;

    try {
      await ClientsService.deleteClient(selectedId);
      await loadClients();
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
    }

    setSelectedId(null);
  };

  return (
    <IonPage className="clients-page">
      <IonHeader>
        <IonToolbar className="clients-toolbar">
          <IonTitle>App Clients</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="clients-content">
        <div className="clients-container">

          <div className="clients-heading">
            <div>
              <h1>Mis clientes</h1>
              <p>Gestiona tus clientes fácilmente</p>
            </div>

            <IonButton
              className="add-client-button"
              onClick={() => navigate('/new-client')}
            >
              + Añadir cliente
            </IonButton>
          </div>

          <div className="clients-section">
            <h2>Listado de clientes</h2>
            <p className="clients-description">
              Tienes {clients.length} clientes registrados
            </p>

            {clients.length === 0 ? (
              <div className="empty-clients">
                <IonText>
                  <p>No hay clientes registrados todavía.</p>
                </IonText>
              </div>
            ) : (
              <div className="clients-list">
                {clients.map((client) => (
                  <IonCard className="client-card" key={client.id}>
                    <IonCardContent>
                      <div className="client-information">
                        <h3>{client.name}</h3>
                        <p>{client.email}</p>
                        <p>{client.phone}</p>
                        <span>ID: {client.id}</span>
                      </div>

                      <div className="client-actions">
                        <IonButton
                          fill="outline"
                          className="edit-button"
                          onClick={() =>
                            navigate(`/edit-client/${client.id}`)
                          }
                        >
                          Editar
                        </IonButton>

                        <IonButton
                          fill="solid"
                          className="delete-button"
                          onClick={() => {
                            setSelectedId(client.id ?? null);
                            setShowAlert(true);
                          }}
                        >
                          Eliminar
                        </IonButton>
                      </div>
                    </IonCardContent>
                  </IonCard>
                ))}
              </div>
            )}
          </div>
        </div>

        <IonAlert
          isOpen={showAlert}
          header="Eliminar cliente"
          message="¿Estás seguro de que quieres eliminar este cliente?"
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => setSelectedId(null)
            },
            {
              text: 'Eliminar',
              role: 'destructive',
              handler: deleteClient
            }
          ]}
          onDidDismiss={() => setShowAlert(false)}
        />
      </IonContent>
    </IonPage>
  );
}
