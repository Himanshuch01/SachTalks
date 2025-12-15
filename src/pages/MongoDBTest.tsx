import { useState } from "react";
import { mongodb } from "@/lib/mongodb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Database, Plus, Search, Trash2 } from "lucide-react";

interface TestDocument {
  _id?: { $oid: string };
  name: string;
  message: string;
  createdAt: string;
}

const MongoDBTest = () => {
  const [collection, setCollection] = useState("test_collection");
  const [documents, setDocuments] = useState<TestDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const data = await mongodb.find<TestDocument>(collection);
      setDocuments(data);
      toast.success(`Found ${data.length} documents`);
    } catch (error) {
      console.error("Error fetching:", error);
      toast.error(error instanceof Error ? error.message : "Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  const insertDocument = async () => {
    if (!newName || !newMessage) {
      toast.error("Please fill in both fields");
      return;
    }
    
    setLoading(true);
    try {
      await mongodb.insertOne(collection, {
        name: newName,
        message: newMessage,
        createdAt: new Date().toISOString()
      });
      toast.success("Document inserted successfully");
      setNewName("");
      setNewMessage("");
      await fetchDocuments();
    } catch (error) {
      console.error("Error inserting:", error);
      toast.error(error instanceof Error ? error.message : "Failed to insert document");
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    setLoading(true);
    try {
      await mongodb.deleteOne(collection, { _id: { $oid: id } });
      toast.success("Document deleted");
      await fetchDocuments();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
            <Database className="w-10 h-10" />
            MongoDB Connection Test
          </h1>
          <p className="text-muted-foreground mt-2">
            Test your MongoDB Atlas connection
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Collection Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Collection name"
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                className="flex-1"
              />
              <Button onClick={fetchDocuments} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                Fetch Data
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Insert New Document</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <Input
                placeholder="Message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </div>
            <Button onClick={insertDocument} disabled={loading} className="w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Insert Document
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents ({documents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No documents found. Click "Fetch Data" to load documents or insert a new one.
              </p>
            ) : (
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <div
                    key={doc._id?.$oid || index}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div>
                      <p className="font-medium text-foreground">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">{doc.message}</p>
                      {doc.createdAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(doc.createdAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    {doc._id?.$oid && (
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteDocument(doc._id!.$oid)}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MongoDBTest;
