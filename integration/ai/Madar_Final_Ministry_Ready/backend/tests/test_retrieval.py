from app.services.retrieval import retrieve
def test_topic():
 x=retrieve("الأمانة",domain="transactions",topic="الأمانة",top_k=1)
 assert x and x[0]["topic"]=="الأمانة"
