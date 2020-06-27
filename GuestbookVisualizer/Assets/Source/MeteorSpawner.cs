using UnityEngine;

[RequireComponent(typeof(BoxCollider))]
public class MeteorSpawner : MonoBehaviour
{
    private const float RANDOM_SPAWN_RATE_SECONDS = 60f;

    public GameObject MeteorPrefab;
    public Vector3 MinVelocity;
    public Vector3 MaxVelocity;

    private BoxCollider boxCollider;

    private void Start()
    {
        boxCollider = gameObject.GetComponent<BoxCollider>();
    }

    private void Update()
    {
        float showChance = Time.deltaTime / RANDOM_SPAWN_RATE_SECONDS;
        bool spawnMeteor = Random.Range(0f, 1f) <= showChance;
        if (spawnMeteor)
        {
            float xVal = Random.Range(MinVelocity.x, MaxVelocity.x);
            float yVal = Random.Range(MinVelocity.y, MaxVelocity.y);
            float zVal = Random.Range(MinVelocity.z, MaxVelocity.z);
            Vector3 velocity = new Vector3(xVal, yVal, zVal);
            GameObject meteor = GameObject.Instantiate(MeteorPrefab);
            meteor.GetComponent<Meteor>().Initialize(velocity);

            xVal = Random.Range(boxCollider.bounds.max.x, boxCollider.bounds.min.x);
            yVal = Random.Range(boxCollider.bounds.max.y, boxCollider.bounds.min.y);
            zVal = Random.Range(boxCollider.bounds.max.z, boxCollider.bounds.min.z);
            Vector3 spawnPos = new Vector3(xVal, yVal, zVal);
            meteor.transform.position = spawnPos;
        }
    }
}
