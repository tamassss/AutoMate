from django.http import JsonResponse
from AutoApp.services.user_data import get_user_by_id, write_all_userdata 
def getUserStats(request, uid:int):
    user = get_user_by_id(uid)
    if not user:
        return JsonResponse({"error": "User not found"}, status=404)

    return JsonResponse(user, safe=False)

def getAllUserData(request,uid:int):
    data_collector = write_all_userdata(uid)
    if not data_collector:
        return JsonResponse({"error": "User not found"}, status=404)

    return JsonResponse(data_collector, safe=False)