import pandas as pd
import numpy as np
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import MiniBatchKMeans
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import seaborn as sns

# Step 1: Load data in chunks (for 1M rows)
chunksize = 10000  # Adjust based on RAM
chunks = []
for chunk in pd.read_csv('big5_data.csv', sep='\t', chunksize=chunksize):
    chunks.append(chunk)
df = pd.concat(chunks, ignore_index=True)

# Step 2: Define trait columns based on your DB
ext_cols = [f'EXT{i}' for i in range(1, 11)]
est_cols = [f'EST{i}' for i in range(1, 11)]
agr_cols = [f'AGR{i}' for i in range(1, 11)]
csn_cols = [f'CSN{i}' for i in range(1, 11)]
opn_cols = [f'OPN{i}' for i in range(1, 11)]

trait_cols = ext_cols + est_cols + agr_cols + csn_cols + opn_cols

# Step 3: Impute missing values (using mean strategy)
imputer = SimpleImputer(strategy='mean')
df[trait_cols] = imputer.fit_transform(df[trait_cols])

# Step 4: Calculate OCEAN scores (after imputation)
df['Extraversion'] = df[ext_cols].mean(axis=1)
df['Neuroticism'] = df[est_cols].mean(axis=1)
df['Agreeableness'] = df[agr_cols].mean(axis=1)
df['Conscientiousness'] = df[csn_cols].mean(axis=1)
df['Openness'] = df[opn_cols].mean(axis=1)

# Step 5: Normalize features
features = ['Extraversion', 'Neuroticism', 'Agreeableness', 'Conscientiousness', 'Openness']
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df[features])

# Step 6: Cluster data (using MiniBatchKMeans for large datasets)
kmeans = MiniBatchKMeans(n_clusters=4, batch_size=10000, random_state=42)
df['Cluster'] = kmeans.fit_predict(X_scaled)

# Step 7: Analyze centroids and map to archetypes
centroids = scaler.inverse_transform(kmeans.cluster_centers_)
centroids_df = pd.DataFrame(centroids, columns=features)
print("Cluster Centers (Original Scale):")
print(centroids_df)

# Map clusters (adjust keys 0-3 after inspecting centroids)
archetype_map = {
    0: 'Average',       # Medium traits
    1: 'Reserved',      # Low Extraversion/Openness, low Neuroticism
    2: 'Role Model',    # High positive traits, low Neuroticism
    3: 'Self-Centered'  # High Extraversion, low Agreeableness/Conscientiousness
}
df['PersonalityType'] = df['Cluster'].map(archetype_map)

# Step 8: Train classifier to predict personality type
X = df[features]
y = df['PersonalityType']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
clf = RandomForestClassifier(random_state=42)
clf.fit(X_train, y_train)

# Step 9: Evaluate model
y_pred = clf.predict(X_test)
print('Accuracy:', accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))

# Step 10: Visualize clusters (subsample for speed)
sample_size = 10000  # Adjust if needed
pca = PCA(n_components=2)
reduced = pca.fit_transform(X_scaled[:sample_size])
plt.figure(figsize=(10, 6))
sns.scatterplot(x=reduced[:, 0], y=reduced[:, 1], hue=df['PersonalityType'][:sample_size], palette='viridis', alpha=0.6)
plt.title('PCA Visualization of Personality Clusters')
plt.xlabel('Principal Component 1')
plt.ylabel('Principal Component 2')
plt.legend()
plt.show()

# Step 11: Save models
import joblib
joblib.dump(clf, 'personality_classifier.pkl')
joblib.dump(scaler, 'personality_scaler.pkl')
joblib.dump(kmeans, 'personality_kmeans.pkl')

# Example: Predict for new user (input OCEAN scores)
new_user = np.array([[3.5, 2.0, 4.0, 3.5, 4.5]])  # [Extraversion, Neuroticism, Agreeableness, Conscientiousness, Openness]
new_user_scaled = scaler.transform(new_user)
prediction = clf.predict(new_user_scaled)
print(f'Predicted Personality Type: {prediction[0]}')
