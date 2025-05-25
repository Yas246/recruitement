"use client";

import AdminRoute from "@/app/components/AdminRoute";
import VideoCall from "@/app/components/VideoCall";
import { useAuth } from "@/app/contexts/AuthContext";
import { FirestoreDocument, firestoreService } from "@/firebase";
import { Timestamp } from "firebase/firestore";
import { DateTime } from "luxon";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaCalendarAlt,
  FaClock,
  FaFilter,
  FaLink,
  FaUsers,
  FaVideo,
} from "react-icons/fa";

interface VideoMeeting extends FirestoreDocument {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  participants: string[];
  participantDetails: {
    id: string;
    name: string;
    email: string;
    role: string;
  }[];
  status: "scheduled" | "completed" | "cancelled";
  roomId: string;
  createdAt: Date | Timestamp;
  createdBy: string;
}

interface User extends FirestoreDocument {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  role: string;
}

export default function AdminVideoCall() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<VideoMeeting[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: 30,
    participants: [] as string[],
    meetingLink: "",
  });
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeMeeting, setActiveMeeting] = useState<VideoMeeting | null>(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [participantSearch, setParticipantSearch] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch meetings
      const meetingsCollection =
        await firestoreService.queryDocuments<VideoMeeting>("videoMeetings");
      if (meetingsCollection) {
        setMeetings(meetingsCollection);
      }

      // Fetch users with complete data
      const usersCollection = await firestoreService.queryDocuments<User>(
        "users"
      );
      if (usersCollection) {
        // Filtrer et transformer les données utilisateur
        const processedUsers = usersCollection
          .filter((user) => user && user.email) // Vérifier que l'utilisateur existe et a un email
          .map((user) => ({
            id: user.id || "",
            email: user.email || "",
            name: user.name || user.displayName || user.email.split("@")[0], // Utiliser le premier nom disponible
            role: user.role || "other",
          }));

        console.log("Processed users:", processedUsers); // Pour le débogage
        setUsers(processedUsers);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleParticipantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      participants: checked
        ? [...prev.participants, value]
        : prev.participants.filter((id) => id !== value),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      console.log("Starting meeting creation...");

      // Générer un ID unique pour le document
      const meetingId = crypto.randomUUID();
      const roomId = `omshina-meeting-${meetingId}`;

      console.log("Generated IDs:", { meetingId, roomId });

      // Récupérer les détails des participants
      const participantDetails = formData.participants.map((participantId) => {
        const user = users.find((u) => u.id === participantId);
        return {
          id: participantId,
          name: user?.name || "Unknown",
          email: user?.email || "",
          role: user?.role || "unknown",
        };
      });

      console.log("Participant details:", participantDetails);

      const meetingData: VideoMeeting = {
        id: meetingId,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        participants: formData.participants,
        participantDetails,
        status: "scheduled",
        roomId,
        createdAt: new Date(),
        createdBy: user.uid,
      };

      console.log("Meeting data to create:", meetingData);

      // Créer le document avec l'ID spécifié
      await firestoreService.createDocument(
        "videoMeetings",
        meetingId,
        meetingData
      );

      console.log("Meeting created successfully");

      // Vérifier que le document a bien été créé
      const createdMeeting = await firestoreService.getDocument(
        "videoMeetings",
        meetingId
      );
      if (!createdMeeting) {
        throw new Error("Le document n'a pas été créé correctement");
      }

      console.log("Meeting verified in database:", createdMeeting);

      setMeetings((prev) => [...prev, meetingData]);
      setShowForm(false);
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        duration: 30,
        participants: [],
        meetingLink: "",
      });
      toast.success("Entretien programmé avec succès !");
    } catch (err) {
      console.error("Error creating meeting:", err);
      toast.error(
        "Erreur lors de la programmation de l'entretien. Veuillez réessayer."
      );
    }
  };

  const updateMeetingStatus = async (
    meetingId: string,
    status: "scheduled" | "completed" | "cancelled"
  ) => {
    try {
      console.log("Checking if meeting exists:", meetingId);

      // Vérifier si le document existe
      const existingMeeting = await firestoreService.getDocument(
        "videoMeetings",
        meetingId
      );

      if (!existingMeeting) {
        console.error("Meeting not found:", meetingId);
        toast.error("La réunion n'existe pas dans la base de données");
        return;
      }

      console.log("Updating meeting status:", { meetingId, status });

      // Mettre à jour le document avec l'ID spécifié
      await firestoreService.updateDocument("videoMeetings", meetingId, {
        status,
        updatedAt: new Date(),
      });

      // Mettre à jour l'état local
      setMeetings((prev) =>
        prev.map((meeting) =>
          meeting.id === meetingId
            ? { ...meeting, status, updatedAt: new Date() }
            : meeting
        )
      );

      toast.success(`Statut de l'entretien mis à jour : ${status}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast.error("Erreur lors de la mise à jour du statut de l'entretien");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return DateTime.fromISO(dateString).toFormat("dd MMM yyyy");
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            Scheduled
          </span>
        );
      case "completed":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
            {status}
          </span>
        );
    }
  };

  const filteredMeetings = meetings
    .filter((meeting) => {
      if (statusFilter === "all") return true;
      return meeting.status === statusFilter;
    })
    .sort((a, b) => {
      // Créer des dates complètes en combinant date et heure
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      // Trier du plus récent au plus ancien
      return dateB.getTime() - dateA.getTime();
    });

  const handleJoinMeeting = (meeting: VideoMeeting) => {
    setActiveMeeting(meeting);
    setShowVideoCall(true);
  };

  const filteredUsers = users
    .filter((user) => user.role !== "admin")
    .filter((user) => {
      if (!participantSearch) return true;
      const searchLower = participantSearch.toLowerCase();
      return (
        (user.name?.toLowerCase() || "").includes(searchLower) ||
        (user.email?.toLowerCase() || "").includes(searchLower) ||
        (user.role?.toLowerCase() || "").includes(searchLower)
      );
    })
    .sort((a, b) => {
      const nameA = a.name || "";
      const nameB = b.name || "";
      return nameA.localeCompare(nameB);
    });

  return (
    <AdminRoute>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Entretiens
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Planifier et gérer les entretiens vidéo avec les candidats
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <FaVideo className="mr-2" /> Planifier un nouvel entretien
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md dark:bg-red-900 dark:text-red-100">
            {error}
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex items-center mb-4 sm:mb-0">
                <FaFilter className="mr-2 text-gray-500 dark:text-gray-400" />
                <select
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tous les entretiens</option>
                  <option value="scheduled">Programmés</option>
                  <option value="completed">Terminés</option>
                  <option value="cancelled">Annulés</option>
                </select>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredMeetings.length} of {meetings.length} meetings
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Détails de l'entretien
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date & Heure
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Participants
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredMeetings.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                        >
                          Aucun entretien trouvé
                        </td>
                      </tr>
                    ) : (
                      filteredMeetings.map((meeting) => (
                        <tr
                          key={meeting.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {meeting.title}
                            </div>
                            {meeting.description && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs truncate">
                                {meeting.description}
                              </div>
                            )}
                            <a
                              href={`https://meet.jit.si/${meeting.roomId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 flex items-center"
                              onClick={(e) => {
                                e.preventDefault();
                                handleJoinMeeting(meeting);
                              }}
                            >
                              <FaLink className="mr-1" /> Join Meeting
                            </a>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <FaCalendarAlt className="mr-2 text-gray-400 dark:text-gray-500" />
                              {formatDate(meeting.date)}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                              <FaClock className="mr-2 text-gray-400 dark:text-gray-500" />
                              {meeting.time} ({meeting.duration} min)
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-start">
                              <FaUsers className="mr-2 mt-1 text-gray-400 dark:text-gray-500" />
                              <div>
                                {meeting.participants.map((participant) => {
                                  const user = users.find(
                                    (u) =>
                                      u.id === participant ||
                                      u.email === participant
                                  );
                                  return (
                                    <div
                                      key={participant}
                                      className="mb-1 last:mb-0"
                                    >
                                      {user ? user.name : participant}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(meeting.status)}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium">
                            <div className="space-x-2">
                              {meeting.status === "scheduled" && (
                                <>
                                  <button
                                    onClick={() =>
                                      updateMeetingStatus(
                                        meeting.id,
                                        "completed"
                                      )
                                    }
                                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                  >
                                    Complete
                                  </button>
                                  <button
                                    onClick={() =>
                                      updateMeetingStatus(
                                        meeting.id,
                                        "cancelled"
                                      )
                                    }
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                              {meeting.status === "cancelled" && (
                                <button
                                  onClick={() =>
                                    updateMeetingStatus(meeting.id, "scheduled")
                                  }
                                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  Réprogrammer
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Schedule Meeting Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
              <div className="px-4 py-3 border-b dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Planifier un nouvel entretien
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Titre de l'entretien*
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Date*
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Time*
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Durée (minutes)
                    </label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>1 heure</option>
                      <option value={90}>1.5 heures</option>
                      <option value={120}>2 heures</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Participants*
                    </label>
                    <div className="mb-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Rechercher par nom, email ou type de compte..."
                          value={participantSearch}
                          onChange={(e) => setParticipantSearch(e.target.value)}
                          className="w-full px-3 py-2 pl-9 text-sm border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-4 w-4 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-md p-2 space-y-2">
                      {filteredUsers.length === 0 ? (
                        <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                          Aucun participant trouvé
                        </div>
                      ) : (
                        filteredUsers.map((user) => (
                          <label
                            key={user.id}
                            className="flex items-start space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              value={user.id}
                              checked={formData.participants.includes(user.id)}
                              onChange={handleParticipantChange}
                              className="mt-1 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {user.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user.email}
                              </div>
                              <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-0.5">
                                {user.role === "student" && "Étudiant"}
                                {user.role === "worker" && "Travailleur"}
                                {user.role === "artist" && "Artiste"}
                                {user.role === "other" && "Autre"}
                              </div>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formData.participants.length} participant(s)
                        sélectionné(s)
                      </p>
                      {formData.participants.length > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              participants: [],
                            }))
                          }
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Effacer la sélection
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Planifier l'entretien
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Video Call Component */}
        {showVideoCall && activeMeeting && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-auto">
              <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {activeMeeting.title}
                </h2>
                <button
                  onClick={() => setShowVideoCall(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  &times;
                </button>
              </div>
              <div className="p-4">
                <VideoCall
                  roomName={activeMeeting.roomId}
                  userType="admin"
                  userName={user?.displayName || "Admin"}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminRoute>
  );
}
